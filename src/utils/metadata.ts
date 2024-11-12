import { VideoFile, VideoMetadata, ExportFormat } from '../types';

export async function extractMetadata(file: File): Promise<VideoMetadata> {
  // In a real application, this would use a video metadata extraction library
  // For demo purposes, we'll return mock data
  return {
    title: file.name.replace(/\.[^/.]+$/, ''),
    duration: '00:03:24',
    resolution: '1920x1080',
    frameRate: '29.97',
    codec: 'H.264'
  };
}

export function exportMetadata(files: VideoFile[], format: ExportFormat): string {
  switch (format) {
    case 'json':
      return JSON.stringify(files.map(f => f.metadata), null, 2);
    case 'csv':
      const headers = ['title', 'year', 'genre', 'duration', 'resolution', 'frameRate'];
      const rows = files.map(f => headers.map(h => f.metadata[h] || '').join(','));
      return [headers.join(','), ...rows].join('\n');
    case 'xml':
      const xmlContent = files.map(f => `
        <video>
          <title>${f.metadata.title}</title>
          <year>${f.metadata.year || ''}</year>
          <genre>${f.metadata.genre || ''}</genre>
          <duration>${f.metadata.duration}</duration>
          <resolution>${f.metadata.resolution}</resolution>
          <frameRate>${f.metadata.frameRate}</frameRate>
        </video>
      `).join('');
      return `<?xml version="1.0" encoding="UTF-8"?>\n<videos>${xmlContent}</videos>`;
    default:
      throw new Error('Unsupported format');
  }
}