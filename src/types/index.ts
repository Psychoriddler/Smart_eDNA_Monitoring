export interface Species {
  name: string;
  count: number;
}

export interface AnalysisResult {
  species: Species[];
}

export interface UploadState {
  file: File | null;
  isAnalyzing: boolean;
  results: AnalysisResult | null;
  error: string | null;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  institution: string;
  publishedDate: string;
  tags: string[];
  likes: number;
  comments: number;
  downloadUrl?: string;
  authorAvatar?: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
}
