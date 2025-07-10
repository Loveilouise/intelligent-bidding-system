
export interface ProjectInfo {
  name: string;
  type: string;
  description: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'uploaded' | 'processing' | 'analyzed';
}

export interface BidDocument {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'table';
  status: 'draft' | 'generated' | 'edited';
  level: number;
  children?: BidDocument[];
}

export interface CatalogItem {
  id: string;
  title: string;
  level: number;
  expanded?: boolean;
  wordCount?: number;
  children?: CatalogItem[];
}
