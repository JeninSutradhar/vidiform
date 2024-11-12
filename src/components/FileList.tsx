import { motion } from 'framer-motion';
import { Trash2, FileVideo } from 'lucide-react';
import { VideoFile } from '../types';

interface Props {
  files: VideoFile[];
  currentFile: VideoFile | null;
  onFileSelect: (file: VideoFile) => void;
  onRemoveFile: (fileName: string) => void;
}

export default function FileList({ files, currentFile, onFileSelect, onRemoveFile }: Props) {
  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-500 py-8"
      >
        <FileVideo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No files selected</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <motion.div
          key={file.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
            currentFile?.name === file.name
              ? 'bg-indigo-50 border border-indigo-200'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => onFileSelect(file)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <FileVideo className={`w-5 h-5 mr-3 ${
              currentFile?.name === file.name ? 'text-indigo-500' : 'text-gray-400'
            }`} />
            <div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.metadata.resolution}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile(file.name);
            }}
            className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}