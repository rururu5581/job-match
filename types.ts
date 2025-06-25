
export interface JobSeekerProfile {
  workExperience: string;
  skills: string[];
  desiredSalary: number | null;
  desiredLocation: string;
  desiredIndustry: string;
}

export interface JobOpening {
  // Key fields from CSV relevant for matching and display
  id: string; // 'JOB ID'
  companyName: string; // '企業名'
  position: string; // 'ポジション'
  jobDescription: string; // '業務内容'
  idealCandidate: string; // '求める人材'
  location: string; // '勤務地'
  qualifications: string; // '応募資格'
  keywords: string; // '★キーワード'
  minSalary: number | null; // '年収下限'
  maxSalary: number | null; // '年収上限'
  
  // Storing all raw fields from CSV for detailed view
  raw: { [key: string]: string }; 
}

export interface MatchScore {
  skill: number;
  salary: number;
  experience: number;
  location: number;
  total: number;
}

export interface MatchResult {
  job: JobOpening;
  score: MatchScore;
}

// For Google Search grounding (not used in this version but good to have)
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Other types of chunks can be added here
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // Other candidate fields
}
