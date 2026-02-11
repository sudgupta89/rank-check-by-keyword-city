export interface SeoResult {
  keyword: string;
  city: string;
  search_query: string;
  target_url: string;
  ranking_status: "Found" | "Not Found";
  position: number | null;
  serp_page: number | null;
  ranking_url: string | null;
  seo_note: string;
  competitors?: string[]; // Extra field for visualization
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisState {
  isLoading: boolean;
  data: SeoResult | null;
  error: string | null;
  rawGrounding: GroundingChunk[];
}