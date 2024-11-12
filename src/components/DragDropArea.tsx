import { Upload } from 'lucide-react';

interface Props {
  onFilesSelected: (files: FileList) => void;
}

export default function DragDropArea({ onFilesSelected }: Props) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-indigo-400');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-indigo-400');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-indigo-400');
    onFilesSelected(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 p-8 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h6 className="text-lg font-medium mb-2">Drag & Drop video files here</h6>
      <span className="block text-sm text-gray-500 mb-4">OR</span>
      <label className="inline-block">
        <input
          type="file"
          className="hidden"
          multiple
          accept="video/*"
          onChange={handleFileInput}
        />
        <span className="btn-primary">
          Browse Files
        </span>
      </label>
    </div>
  );
}