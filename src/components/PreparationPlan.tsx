import React, { useState, useMemo } from 'react';
import { DashboardData } from '../types';
import { BookOpen, Code, Terminal, Target, Clock, CheckCircle2, AlertCircle, ChevronRight, BrainCircuit, Database, Layout } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PreparationPlanProps {
  data: DashboardData;
}

interface PrepGuide {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  oaDetails: {
    duration: string;
    sections: string[];
    description: string;
  };
  dsaTopics: string[];
  coreSubjects: string[];
  interviewTips: string[];
}

const DEFAULT_GUIDE: PrepGuide = {
  difficulty: 'Medium',
  oaDetails: {
    duration: '90-120 mins',
    sections: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Coding (2 Questions)'],
    description: 'Standard online assessment focusing on speed and accuracy in aptitude, followed by basic to medium level coding questions.'
  },
  dsaTopics: ['Arrays & Strings', 'HashMaps', 'Two Pointers', 'Basic Recursion'],
  coreSubjects: ['OOPs Concepts', 'DBMS (SQL Queries)', 'Operating Systems (Basic)'],
  interviewTips: [
    'Be ready to explain your resume projects in depth.',
    'Practice writing code on paper or a whiteboard.',
    'Prepare a strong introduction and "Why this company?" answer.'
  ]
};

const COMPANY_GUIDES: Record<string, PrepGuide> = {
  'TCS': {
    difficulty: 'Medium',
    oaDetails: {
      duration: '180 mins (NQT)',
      sections: ['Numerical Ability', 'Verbal Ability', 'Reasoning Ability', 'Programming Logic', 'Hands-on Coding (2 Qs)'],
      description: 'TCS NQT is divided into Foundation and Advanced sections. The coding section usually has one easy (math/array based) and one medium (strings/matrix) question. For Digital/Prime roles, the difficulty is significantly higher.'
    },
    dsaTopics: ['Arrays', 'Strings', 'Number Theory / Math', 'Matrix Traversal', 'Basic DP'],
    coreSubjects: ['C/C++/Java output guessing', 'OOPs', 'DBMS (Joins, Normalization)', 'Software Engineering basics'],
    interviewTips: [
      'TCS interviews heavily focus on your final year project and your role in it.',
      'Be prepared for managerial questions (MR round) testing your adaptability and ethics.',
      'Know the basics of emerging technologies (Cloud, AI/ML) if mentioned in your resume.'
    ]
  },
  'Cognizant': {
    difficulty: 'Medium',
    oaDetails: {
      duration: '120 mins',
      sections: ['Quantitative Ability', 'English Comprehension', 'Logical Ability', 'Automata Fix (Debugging)'],
      description: 'Cognizant focuses heavily on debugging and code correction (Automata Fix) rather than writing code from scratch for the GenC profile. For GenC Next, expect competitive programming level questions.'
    },
    dsaTopics: ['Code Debugging', 'Arrays', 'Strings', 'Sorting Algorithms', 'Data Structures basics'],
    coreSubjects: ['SQL Queries', 'RDBMS Concepts', 'OOPs (Polymorphism, Inheritance)'],
    interviewTips: [
      'Practice debugging C/C++/Java code snippets quickly.',
      'Communication skills are highly evaluated during the technical and HR rounds.',
      'Be ready to write SQL queries for given schema scenarios.'
    ]
  },
  'Infosys': {
    difficulty: 'Hard',
    oaDetails: {
      duration: '100 mins',
      sections: ['Logical Reasoning', 'Mathematical Ability', 'Verbal Ability', 'Pseudocode', 'Puzzle Solving'],
      description: 'Infosys OA is known for its strict sectional time limits and challenging puzzle-solving sections. The pseudocode section requires strong fundamentals in data structures.'
    },
    dsaTopics: ['Dynamic Programming', 'Graphs', 'Trees', 'Greedy Algorithms (for HackWithInfy)'],
    coreSubjects: ['Data Structures', 'Algorithms', 'DBMS', 'Computer Networks'],
    interviewTips: [
      'For Specialist Programmer (SP) roles, expect hard LeetCode style questions.',
      'Focus on optimizing your code (Time and Space Complexity).',
      'Be prepared to discuss your approach before writing the actual code.'
    ]
  },
  'Accenture': {
    difficulty: 'Medium',
    oaDetails: {
      duration: '90 mins + 45 mins',
      sections: ['Cognitive Assessment', 'Technical Assessment (Pseudocode, Cloud, Network)', 'Coding (2 Qs)'],
      description: 'Accenture has an elimination-based cognitive round. If you clear it, you proceed to the coding round. The coding questions are generally easy to medium.'
    },
    dsaTopics: ['Arrays', 'Strings', 'Loops & Conditionals', 'Basic Math'],
    coreSubjects: ['Cloud Computing Basics', 'Network Security', 'MS Office Fundamentals', 'Pseudocode'],
    interviewTips: [
      'Accenture interviews are often combined Tech + HR.',
      'Focus on behavioral questions and situational judgment.',
      'Highlight any certifications or courses related to Cloud, Agile, or modern tech stacks.'
    ]
  },
  'Wipro': {
    difficulty: 'Easy',
    oaDetails: {
      duration: '128 mins (NLTH)',
      sections: ['Aptitude', 'Logical', 'Verbal', 'Written Communication (Essay)', 'Coding (2 Qs)'],
      description: 'Wipro NLTH includes a unique essay writing section. The coding section typically features one easy and one medium question.'
    },
    dsaTopics: ['Strings', 'Arrays', 'Basic Pattern Printing', 'LCM/GCD logic'],
    coreSubjects: ['OOPs', 'Basic SQL', 'Operating Systems'],
    interviewTips: [
      'Practice typing and structuring essays on technical or general topics within 20 minutes.',
      'Be thorough with the programming language you choose for the OA.',
      'HR rounds focus on relocation readiness and bond agreements.'
    ]
  },
  'Capgemini': {
    difficulty: 'Medium',
    oaDetails: {
      duration: '100 mins',
      sections: ['Game-based Aptitude', 'English Communication', 'Pseudocode', 'Spoken English'],
      description: 'Capgemini uses a unique game-based aptitude test (deductive logical thinking, grid challenges) instead of traditional MCQs. The pseudocode section is highly conceptual.'
    },
    dsaTopics: ['Data Structures (Stacks, Queues, Trees)', 'Algorithms (Sorting, Searching)'],
    coreSubjects: ['C/C++ Fundamentals', 'Data Structures', 'OOPs'],
    interviewTips: [
      'Practice game-based aptitude tests online (e.g., AON assessments).',
      'Brush up on your spoken English and pronunciation for the automated voice assessment.',
      'Technical interviews focus heavily on your core engineering subjects.'
    ]
  }
};

export function PreparationPlan({ data }: PreparationPlanProps) {
  // Extract unique companies and sort by total placements
  const topCompanies = useMemo(() => {
    const companyMap = new Map<string, number>();
    data.records.forEach(r => {
      companyMap.set(r.companyName, (companyMap.get(r.companyName) || 0) + r.numberOfStudentsPlaced);
    });
    
    return Array.from(companyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [data]);

  const [selectedCompany, setSelectedCompany] = useState<string>(topCompanies[0] || 'TCS');

  const getGuide = (companyName: string): PrepGuide => {
    // Try to find an exact or partial match in our predefined guides
    const match = Object.keys(COMPANY_GUIDES).find(k => companyName.toLowerCase().includes(k.toLowerCase()));
    return match ? COMPANY_GUIDES[match] : DEFAULT_GUIDE;
  };

  const guide = getGuide(selectedCompany);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Sidebar: Company List */}
      <div className="w-full md:w-72 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Target size={18} className="text-blue-600" />
            Target Companies
          </h3>
          <p className="text-xs text-gray-500 mt-1">Based on campus history</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
          {topCompanies.map((company) => (
            <button
              key={company}
              onClick={() => setSelectedCompany(company)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group",
                selectedCompany === company 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3 truncate">
                <img 
                  src={`https://logo.clearbit.com/${company.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '')}.com`}
                  alt={company}
                  className="w-6 h-6 rounded bg-white border border-gray-100 object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=eff6ff&color=2563eb&bold=true&font-size=0.4`;
                  }}
                />
                <span className="truncate">{company}</span>
              </div>
              <ChevronRight size={16} className={cn(
                "transition-transform",
                selectedCompany === company ? "text-blue-600 translate-x-1" : "text-transparent group-hover:text-gray-400"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Prep Guide */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-white flex items-start justify-between shrink-0">
          <div className="flex items-center gap-4">
            <img 
              src={`https://logo.clearbit.com/${selectedCompany.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '')}.com`}
              alt={selectedCompany}
              className="w-16 h-16 rounded-xl bg-white border border-gray-100 object-contain shadow-sm p-1"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCompany)}&background=eff6ff&color=2563eb&bold=true&font-size=0.4`;
              }}
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCompany}</h2>
              <p className="text-sm text-gray-500 mt-1">Comprehensive Preparation Guide</p>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
            guide.difficulty === 'Hard' ? "bg-red-50 text-red-700 border-red-200" :
            guide.difficulty === 'Medium' ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-emerald-50 text-emerald-700 border-emerald-200"
          )}>
            {guide.difficulty} Difficulty
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
          
          {/* OA Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Layout size={20} className="text-blue-600" />
              Online Assessment (OA) Structure
            </h3>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Clock size={16} className="text-gray-400" />
                Duration: <span className="text-blue-600">{guide.oaDetails.duration}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {guide.oaDetails.description}
              </p>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assessment Sections</h4>
                <div className="flex flex-wrap gap-2">
                  {guide.oaDetails.sections.map((section, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DSA Topics */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Code size={20} className="text-blue-600" />
                Key DSA Topics
              </h3>
              <ul className="space-y-3">
                {guide.dsaTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded bg-blue-50 flex items-center justify-center shrink-0">
                      <Terminal size={12} className="text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{topic}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Core Subjects */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Database size={20} className="text-blue-600" />
                Core CS Subjects
              </h3>
              <ul className="space-y-3">
                {guide.coreSubjects.map((subject, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded bg-purple-50 flex items-center justify-center shrink-0">
                      <BrainCircuit size={12} className="text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{subject}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Interview Tips */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <AlertCircle size={20} className="text-blue-600" />
              Pro Interview Tips
            </h3>
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
              <ul className="space-y-4">
                {guide.interviewTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
