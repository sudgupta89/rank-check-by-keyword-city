import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeRanking } from './services/geminiService';
import { AnalysisState } from './types';
import { Sparkles, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    data: null,
    error: null,
    rawGrounding: []
  });

  const handleAnalyze = async (keyword: string, city: string, url: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, data: null }));
    
    try {
      const { result, groundingChunks } = await analyzeRanking(keyword, city, url);
      setState({
        isLoading: false,
        data: result,
        error: null,
        rawGrounding: groundingChunks
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Something went wrong. Please check your API key and try again."
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-indigo-500/30 pb-20">
      {/* Header Background Effect */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-full mb-4 border border-indigo-500/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
            <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">Powered by Gemini 3 Flash & Google Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            SEO Rank<span className="text-indigo-500">Check</span> Engine
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Simulate local Google searches instantly to see where you stand against competitors.
          </p>
        </header>

        {/* Input Section */}
        <div className="mb-12">
          <InputForm onAnalyze={handleAnalyze} isLoading={state.isLoading} />
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center text-rose-200">
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {/* Results Section */}
        {state.data && (
          <ResultsDisplay data={state.data} groundingChunks={state.rawGrounding} />
        )}

      </div>
    </div>
  );
};

export default App;