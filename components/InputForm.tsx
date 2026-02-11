import React, { useState } from 'react';
import { Search, MapPin, Globe, Loader2 } from 'lucide-react';

interface InputFormProps {
  onAnalyze: (keyword: string, city: string, url: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword && city && url) {
      onAnalyze(keyword, city, url);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Run Analysis</h2>
        <p className="text-slate-400">Enter your target details to check real-time rankings via AI-simulated search.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
          </div>
          <input
            type="text"
            required
            placeholder="Keyword (e.g. 'best pizza')"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-500 transition-all outline-none"
          />
        </div>

        <div className="md:col-span-3 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
          </div>
          <input
            type="text"
            required
            placeholder="City (e.g. 'New York')"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-500 transition-all outline-none"
          />
        </div>

        <div className="md:col-span-3 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
          </div>
          <input
            type="url"
            required
            placeholder="Target URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-500 transition-all outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-full min-h-[48px] flex items-center justify-center font-semibold rounded-xl text-white shadow-lg transition-all 
              ${isLoading 
                ? 'bg-indigo-600/50 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Analyzing
              </>
            ) : (
              'Check Rank'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;