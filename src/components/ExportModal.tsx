import { useState } from 'react';
import { VideoFile, ExportFormat } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => void;
}

export default function ExportModal({ isOpen, onClose, onExport }: Props) {
  const [format, setFormat] = useState<ExportFormat>('json');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Export Metadata</h3>
        
        <div className="space-y-3 mb-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="format"
              value="json"
              checked={format === 'json'}
              onChange={e => setFormat(e.target.value as ExportFormat)}
              className="mr-2"
            />
            JSON
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="format"
              value="csv"
              checked={format === 'csv'}
              onChange={e => setFormat(e.target.value as ExportFormat)}
              className="mr-2"
            />
            CSV
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="format"
              value="xml"
              checked={format === 'xml'}
              onChange={e => setFormat(e.target.value as ExportFormat)}
              className="mr-2"
            />
            XML
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onExport(format);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}