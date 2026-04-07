import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData, PlacementRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const EXTRACTION_PROMPT = `
Extract structured campus placement data from the provided document. 
Identify:
- Company Name
- Year of visit
- Eligible branches (e.g., CSE, ECE, ME, etc.)
- Average Salary offered (in LPA)
- Brief summary of the selection process (e.g., DSA rounds, HR, Aptitude)
- Key skills required
- Total number of students placed

Return the data as a JSON object matching this schema:
{
  "records": [
    {
      "companyName": "string",
      "year": 2023,
      "branches": ["string"],
      "salaryLPA": 12.5,
      "selectionProcess": "string",
      "keySkills": ["string"],
      "numberOfStudentsPlaced": 10
    }
  ]
}
`;

async function extractRecordsFromFile(file: { data: string; mimeType: string }): Promise<PlacementRecord[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: EXTRACTION_PROMPT },
        {
          inlineData: {
            data: file.data.split(',')[1],
            mimeType: file.mimeType
          }
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          records: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                companyName: { type: Type.STRING },
                year: { type: Type.NUMBER },
                branches: { type: Type.ARRAY, items: { type: Type.STRING } },
                salaryLPA: { type: Type.NUMBER },
                selectionProcess: { type: Type.STRING },
                keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                numberOfStudentsPlaced: { type: Type.NUMBER }
              },
              required: ["companyName", "year", "branches", "salaryLPA"]
            }
          }
        },
        required: ["records"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return result.records || [];
  } catch (e) {
    console.error("Failed to parse records from file", e);
    return [];
  }
}

async function generateSummary(records: PlacementRecord[]): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Based on these placement records, provide a 2-3 sentence overview of the hiring trends, 
      mentioning top companies and salary ranges:
      ${JSON.stringify(records.slice(0, 50))} 
    `
  });
  return response.text || "Summary unavailable.";
}

export async function processPlacementFiles(
  files: { data: string; mimeType: string }[],
  existingRecords: PlacementRecord[] = []
): Promise<DashboardData> {
  // 1. Process all files in parallel for much faster extraction
  const recordsPromises = files.map(file => extractRecordsFromFile(file));
  const recordsArrays = await Promise.all(recordsPromises);
  const newRecords = recordsArrays.flat();

  const allRecords = [...existingRecords, ...newRecords];

  // 2. Calculate trends locally (instant)
  const trendsMap = new Map<number, { totalSalary: number; count: number; totalPlacements: number }>();
  
  allRecords.forEach(r => {
    const year = r.year;
    const current = trendsMap.get(year) || { totalSalary: 0, count: 0, totalPlacements: 0 };
    current.totalSalary += r.salaryLPA;
    current.count += 1;
    current.totalPlacements += r.numberOfStudentsPlaced || 0;
    trendsMap.set(year, current);
  });

  const trends = Array.from(trendsMap.entries())
    .map(([year, stats]) => ({
      year,
      avgSalary: Number((stats.totalSalary / stats.count).toFixed(2)),
      totalPlacements: stats.totalPlacements
    }))
    .sort((a, b) => a.year - b.year);

  // 3. Generate summary in parallel with trends calculation
  const summary = await generateSummary(allRecords);

  return {
    records: allRecords,
    summary,
    trends
  };
}

export async function queryPlacementData(query: string, context: DashboardData, history: { role: 'user' | 'model', content: string }[]) {
  // Format history for the model
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...formattedHistory,
      { role: 'user', parts: [{ text: query }] }
    ],
    config: {
      systemInstruction: `
        You are a Campus Placement Intelligence Assistant. 
        You have access to the following institutional placement data:
        ${JSON.stringify(context)}

        Answer student queries accurately based on this data. 
        If the user asks about general company information, interview trends, or news that is not in the data, use Google Search to find the latest and most accurate information.
        Be helpful, professional, and provide specific details about companies, branches, and processes.
        Use Markdown for formatting.
      `,
      tools: [{ googleSearch: {} }]
    }
  });

  // Extract grounding URLs
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const urls: string[] = [];
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        urls.push(chunk.web.uri);
      }
    });
  }

  return {
    text: response.text,
    urls: [...new Set(urls)] // Remove duplicates
  };
}
