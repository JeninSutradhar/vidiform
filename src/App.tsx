import { useState, useEffect } from 'react';
import { ArrowDownToLine, RefreshCw, Film, Github } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import DragDropArea from './components/DragDropArea';
import FileList from './components/FileList';
import MetadataForm from './components/MetadataForm';
import ExportModal from './components/ExportModal';
import LoadingScreen from './components/LoadingScreen';
import { VideoFile, VideoMetadata, ExportFormat } from './types';
import { extractMetadata, exportMetadata } from './utils/metadata';
import { fetchMovieMetadata } from './utils/tmdb';
import 'react-toastify/dist/ReactToastify.css';

const emptyMetadata: VideoMetadata = {
  title: '',
  duration: '',
  resolution: '',
  frameRate: '',
  codec: ''
};

export default function App() {
  const [files, setFiles] = useState<VideoFile[]>([]);
  const [currentFile, setCurrentFile] = useState<VideoFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilesSelected = async (fileList: FileList) => {
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      const totalFiles = fileList.length;
      const newFiles: VideoFile[] = [];
      
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const metadata = await extractMetadata(file);
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          metadata
        });

        setUploadProgress(((i + 1) / totalFiles) * 100);
      }
      
      setFiles(prev => [...prev, ...newFiles]);
      if (newFiles.length > 0 && !currentFile) {
        setCurrentFile(newFiles[0]);
      }
      
      toast.success(`Successfully processed ${newFiles.length} file(s)`);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error processing files. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
    if (currentFile?.name === fileName) {
      setCurrentFile(files.find(f => f.name !== fileName) || null);
    }
    toast.info('File removed');
  };

  const handleSaveMetadata = (metadata: VideoMetadata) => {
    if (!currentFile) return;
    
    try {
      setFiles(prev =>
        prev.map(f =>
          f.name === currentFile.name ? { ...f, metadata } : f
        )
      );
      setCurrentFile(prev => prev ? { ...prev, metadata } : null);
      
      const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentFile.name}-metadata.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Metadata saved successfully');
    } catch (error) {
      console.error('Error saving metadata:', error);
      toast.error('Error saving metadata');
    }
  };

  const handleFetchMetadata = async () => {
    if (!currentFile) return;
    setIsLoading(true);
    try {
      const movieMetadata = await fetchMovieMetadata(currentFile.metadata.title);
      if (movieMetadata) {
        const updatedMetadata = {
          ...currentFile.metadata,
          ...movieMetadata
        };
        handleSaveMetadata(updatedMetadata);
        toast.success('Metadata fetched successfully');
      } else {
        toast.warning('No metadata found for this title');
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
      toast.error('Error fetching metadata');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: ExportFormat) => {
    try {
      const content = exportMetadata(files, format);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `metadata.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported metadata as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting metadata:', error);
      toast.error('Error exporting metadata');
    }
  };

  return (
    <>
      <AnimatePresence>
        {showInitialLoader && <LoadingScreen />}
      </AnimatePresence>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 text-gray-800">
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 text-white shadow-lg sticky top-0 z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 py-4 flex justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <Film className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 text-transparent bg-clip-text">
                Vidiform
              </h1>
            </div>
            <a
              href="https://github.com/Vixietri/vidiform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-500 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Documentation</span>
            </a>
          </motion.div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="space-y-6">
              <motion.div 
                className="card p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="text-lg font-semibold mb-4 text-indigo-900">Upload Videos</h2>
                <DragDropArea onFilesSelected={handleFilesSelected} />
                
                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="progress-bar">
                      <motion.div 
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Processing: {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div 
                className="card p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="text-lg font-semibold mb-4 text-indigo-900">Selected Files</h2>
                <FileList
                  files={files}
                  currentFile={currentFile}
                  onFileSelect={setCurrentFile}
                  onRemoveFile={handleRemoveFile}
                />
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div 
                className="card p-6"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-indigo-900">Metadata Editor</h2>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowExportModal(true)}
                      disabled={files.length === 0}
                      className="btn-secondary"
                    >
                      <ArrowDownToLine className="w-4 h-4 mr-2" />
                      Export
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFetchMetadata}
                      disabled={!currentFile}
                      className="btn-secondary"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Fetch Metadata
                    </motion.button>
                  </div>
                </div>

                <MetadataForm
                  metadata={currentFile?.metadata || emptyMetadata}
                  onSave={handleSaveMetadata}
                  onReset={() => currentFile && handleSaveMetadata(emptyMetadata)}
                  disabled={!currentFile}
                />
              </motion.div>
            </div>
          </motion.div>
        </main>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-indigo-900/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-6 shadow-xl"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </motion.div>
          </motion.div>
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}
