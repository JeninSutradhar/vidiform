import { useState } from 'react';
import { Plus, Save, RotateCcw, X } from 'lucide-react';
import { VideoMetadata, CustomField } from '../types';

interface Props {
  metadata: VideoMetadata;
  onSave: (metadata: VideoMetadata) => void;
  onReset: () => void;
  disabled: boolean;
}

export default function MetadataForm({ metadata, onSave, onReset, disabled }: Props) {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedMetadata = { ...metadata };

    // Update standard fields
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('custom-')) continue;
      updatedMetadata[key as keyof VideoMetadata] = value;
    }

    // Update custom fields
    customFields.forEach(field => {
      if (field.name) {
        updatedMetadata[field.name] = field.value;
      }
    });

    onSave(updatedMetadata);
  };

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { id: `custom-${Date.now()}`, name: '', value: '' }
    ]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={metadata.title}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="number"
            name="year"
            defaultValue={metadata.year}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Genre</label>
          <input
            type="text"
            name="genre"
            defaultValue={metadata.genre}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration</label>
          <input
            type="text"
            name="duration"
            value={metadata.duration}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Resolution</label>
          <input
            type="text"
            name="resolution"
            value={metadata.resolution}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Frame Rate</label>
          <input
            type="text"
            name="frameRate"
            value={metadata.frameRate}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
            disabled
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          defaultValue={metadata.description}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={disabled}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h6 className="text-sm font-medium text-gray-700">Custom Fields</h6>
          <button
            type="button"
            onClick={addCustomField}
            disabled={disabled}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </button>
        </div>

        {customFields.map(field => (
          <div key={field.id} className="flex gap-4">
            <input
              type="text"
              placeholder="Field Name"
              value={field.name}
              onChange={e => {
                const updated = customFields.map(f =>
                  f.id === field.id ? { ...f, name: e.target.value } : f
                );
                setCustomFields(updated);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={disabled}
            />
            <input
              type="text"
              placeholder="Field Value"
              value={field.value}
              onChange={e => {
                const updated = customFields.map(f =>
                  f.id === field.id ? { ...f, value: e.target.value } : f
                );
                setCustomFields(updated);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => removeCustomField(field.id)}
              disabled={disabled}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={disabled}
          className="btn-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="btn-secondary"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </button>
      </div>
    </form>
  );
}