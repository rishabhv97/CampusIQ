import { DashboardData } from "../types";

export const MOCK_PLACEMENT_DATA: DashboardData = {
  records: [
    // 2021-22 Batch
    { companyName: "Cognizant", year: 2022, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Aptitude, Technical, HR", keySkills: ["Java", "SQL"], numberOfStudentsPlaced: 274 },
    { companyName: "Wipro", year: 2022, branches: ["B.Tech"], salaryLPA: 3.5, selectionProcess: "Online Test, Technical, HR", keySkills: ["C++", "Problem Solving"], numberOfStudentsPlaced: 198 },
    { companyName: "Infosys", year: 2022, branches: ["B.Tech"], salaryLPA: 3.6, selectionProcess: "InfyTQ, Interview", keySkills: ["Python", "Algorithms"], numberOfStudentsPlaced: 116 },
    { companyName: "HCL Technologies", year: 2022, branches: ["B.Tech"], salaryLPA: 4.25, selectionProcess: "Aptitude, Technical, HR", keySkills: ["Networking", "OS"], numberOfStudentsPlaced: 94 },
    { companyName: "DXC Technology", year: 2022, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Aptitude, Technical, HR", keySkills: ["Java", "C#"], numberOfStudentsPlaced: 91 },
    { companyName: "Accenture", year: 2022, branches: ["B.Tech"], salaryLPA: 4.5, selectionProcess: "Cognitive Assessment, Interview", keySkills: ["Analytical Skills"], numberOfStudentsPlaced: 82 },
    { companyName: "Capgemini", year: 2022, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Game-based Aptitude, Technical", keySkills: ["JavaScript", "React"], numberOfStudentsPlaced: 71 },
    { companyName: "TCS", year: 2022, branches: ["B.Tech"], salaryLPA: 3.36, selectionProcess: "NQT, Interview", keySkills: ["Java", "Python"], numberOfStudentsPlaced: 71 },
    
    // 2022-23 Batch
    { companyName: "Cognizant", year: 2023, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Aptitude, Technical, HR", keySkills: ["Java", "SQL"], numberOfStudentsPlaced: 120 },
    { companyName: "Accenture", year: 2023, branches: ["B.Tech"], salaryLPA: 4.5, selectionProcess: "Cognitive Assessment, Interview", keySkills: ["Analytical Skills"], numberOfStudentsPlaced: 62 },
    { companyName: "Mindtree", year: 2023, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Technical MCQ, Coding", keySkills: ["Data Structures"], numberOfStudentsPlaced: 56 },
    { companyName: "TCS", year: 2023, branches: ["B.Tech"], salaryLPA: 3.36, selectionProcess: "NQT, Interview", keySkills: ["Java", "Python"], numberOfStudentsPlaced: 38 },
    { companyName: "L&T", year: 2023, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Aptitude, Technical, HR", keySkills: ["C++", "Java"], numberOfStudentsPlaced: 26 },
    { companyName: "Newgen", year: 2023, branches: ["B.Tech"], salaryLPA: 4.25, selectionProcess: "Aptitude, Technical, HR", keySkills: ["Java", "SQL"], numberOfStudentsPlaced: 25 },
    { companyName: "Capgemini", year: 2023, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Game-based Aptitude, Technical", keySkills: ["JavaScript", "React"], numberOfStudentsPlaced: 23 },
    
    // 2024 Batch
    { companyName: "TCS", year: 2024, branches: ["B.Tech"], salaryLPA: 3.36, selectionProcess: "NQT, Interview", keySkills: ["Java", "Python"], numberOfStudentsPlaced: 46 },
    { companyName: "Academor", year: 2024, branches: ["B.Tech"], salaryLPA: 5.0, selectionProcess: "Aptitude, Technical, HR", keySkills: ["Web Development"], numberOfStudentsPlaced: 23 },
    { companyName: "Pearce Services", year: 2024, branches: ["B.Tech"], salaryLPA: 4.5, selectionProcess: "Technical, HR", keySkills: ["Networking", "Telecom"], numberOfStudentsPlaced: 21 },
    { companyName: "Carelon", year: 2024, branches: ["B.Tech"], salaryLPA: 5.0, selectionProcess: "Aptitude, Technical, HR", keySkills: ["Java", "SQL"], numberOfStudentsPlaced: 20 },
    { companyName: "Wipro", year: 2024, branches: ["B.Tech"], salaryLPA: 3.5, selectionProcess: "Online Test, Technical, HR", keySkills: ["C++", "Problem Solving"], numberOfStudentsPlaced: 20 },
    { companyName: "Accenture", year: 2024, branches: ["B.Tech"], salaryLPA: 4.5, selectionProcess: "Cognitive Assessment, Interview", keySkills: ["Analytical Skills"], numberOfStudentsPlaced: 19 },

    // 2025 Batch
    { companyName: "Infosys", year: 2025, branches: ["B.Tech"], salaryLPA: 3.6, selectionProcess: "Certification based hiring", keySkills: ["System Design"], numberOfStudentsPlaced: 68 },
    { companyName: "Capgemini", year: 2025, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Game-based Aptitude, Technical", keySkills: ["JavaScript", "React"], numberOfStudentsPlaced: 46 },
    { companyName: "LTIMindtree", year: 2025, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Technical MCQ, Coding", keySkills: ["Data Structures"], numberOfStudentsPlaced: 29 },
    { companyName: "HCL Tech", year: 2025, branches: ["B.Tech"], salaryLPA: 4.25, selectionProcess: "Aptitude, Technical, HR", keySkills: ["Networking", "OS"], numberOfStudentsPlaced: 16 },
    { companyName: "LTTechnology Services", year: 2025, branches: ["B.Tech"], salaryLPA: 4.0, selectionProcess: "Aptitude, Technical, HR", keySkills: ["C++", "Java"], numberOfStudentsPlaced: 14 },
  ],
  summary: "Galgotias College of Engineering and Technology has maintained a strong placement record from 2021 to 2025. Mass recruiters like Cognizant, Wipro, Infosys, and TCS consistently hire in large numbers, with peak hiring observed in the 2021-22 batch (Cognizant hiring 274 students). Recent years (2024-25) show continued engagement from top IT firms including Capgemini, LTIMindtree, and Accenture.",
  trends: [
    { year: 2022, avgSalary: 4.0, totalPlacements: 850 },
    { year: 2023, avgSalary: 4.5, totalPlacements: 980 },
    { year: 2024, avgSalary: 5.2, totalPlacements: 1150 },
    { year: 2025, avgSalary: 6.0, totalPlacements: 1340 }
  ]
};

