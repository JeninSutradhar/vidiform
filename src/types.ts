export interface VideoFile {
  name: string;
  size: number;
  type: string;
  metadata: VideoMetadata;
}

export interface VideoMetadata {
  title: string;
  year?: number;
  genre?: string;
  description?: string;
  duration: string;
  resolution: string;
  frameRate: string;
  codec?: string;
  [key: string]: any;
}

export interface CustomField {
  id: string;
  name: string;
  value: string;
}

export type ExportFormat = 'json' | 'csv' | 'xml';