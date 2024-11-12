import { Film } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <Film className="w-16 h-16 mx-auto mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">Vidiform</h1>
        <p className="text-indigo-200">Loading your video metadata editor...</p>
      </div>
    </div>
  );
}