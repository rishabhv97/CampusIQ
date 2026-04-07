export interface PlacementRecord {
  companyName: string;
  year: number;
  branches: string[];
  salaryLPA: number;
  selectionProcess: string;
  keySkills: string[];
  numberOfStudentsPlaced: number;
}

export interface DashboardData {
  records: PlacementRecord[];
  summary: string;
  trends: {
    year: number;
    avgSalary: number;
    totalPlacements: number;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  urls?: string[];
}
