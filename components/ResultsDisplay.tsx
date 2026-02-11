import React, { useState } from 'react';
import { SeoResult, GroundingChunk } from '../types';
import { CheckCircle2, XCircle, ExternalLink, Code, Trophy, Target, FileSearch } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsDisplayProps {
  data: SeoResult;
  groundingChunks: GroundingChunk[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, groundingChunks }) => {
  const [showJson, setShowJson] = useState(false);

  const isFound = data.ranking_status === 'Found';
  const statusColor = isFound ? 'text-emerald-400' : 'text-rose-400';
  const statusBg = isFound ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20';
  const Icon = isFound ? CheckCircle2 : XCircle;

  // Prepare simple chart data from competitors + target if found
  const chartData = (data.competitors || []).map((comp, index) => ({
    name: new URL(comp).hostname.replace('www.', ''),
    position: index + 1, // Mock relative visibility order based on list
    type: 'competitor'
  }));

  if (isFound && data.position) {
    // Inject our target into the chart for comparison
    const targetDomain = new URL(data.target_url).hostname.replace('www.', '');
    // Insert roughly where the position suggests or at the end if deeper
    chartData.push({
      name: targetDomain,
      position: data.position,
      type: 'target'
    });
    // Sort by position (ascending logic for rank, but for bar chart height usually represents "score". 
    // Let's invert it visually or just list them. For simplicity, let's just show a "Visibility" score simulation.)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Card */}
        <div className={`p-6 rounded-2xl border ${statusBg} flex flex-col items-center justify-center text-center`}>
          <Icon className={`h-10 w-10 ${statusColor} mb-3`} />
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Status</h3>
          <p className={`text-2xl font-bold ${statusColor}`}>{data.ranking_status}</p>
        </div>

        {/* Position Card */}
        <div className="p-6 rounded-2xl border border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center text-center">
          <Trophy className="h-10 w-10 text-amber-400 mb-3" />
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Rank Position</h3>
          <p className="text-3xl font-bold text-white">
            {data.position ? `#${data.position}` : '--'}
          </p>
          {data.serp_page && (
            <span className="text-xs text-slate-500 mt-1">Page {data.serp_page}</span>
          )}
        </div>

        {/* Target Card */}
        <div className="p-6 rounded-2xl border border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center text-center overflow-hidden">
          <Target className="h-10 w-10 text-blue-400 mb-3" />
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Target</h3>
          <p className="text-sm font-medium text-white break-all max-w-full px-2 line-clamp-2">
            {new URL(data.target_url).hostname}
          </p>
          <a href={data.target_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 mt-2 hover:underline flex items-center">
            Visit <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Main Analysis Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SEO Insights */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <FileSearch className="h-5 w-5 text-indigo-400 mr-2" />
            <h3 className="text-lg font-bold text-white">AI Analysis & Insights</h3>
          </div>
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              {data.seo_note}
            </p>
            
            {data.ranking_url && (
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Ranking URL Found</span>
                <a href={data.ranking_url} target="_blank" rel="noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 break-all transition-colors">
                  {data.ranking_url}
                </a>
              </div>
            )}
            
            {!isFound && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="text-sm text-amber-200">
                  <span className="font-bold">Tip:</span> Your site was not found in the top results. Consider optimizing for local SEO keywords like "{data.city}" in your title tags and meta descriptions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Competitor / Source List */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Competitors & Sources</h3>
          <div className="flex-1 overflow-y-auto max-h-[250px] space-y-2 pr-2 custom-scrollbar">
            {groundingChunks.length > 0 ? (
               groundingChunks.map((chunk, idx) => (
                <div key={idx} className="flex items-start p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors group">
                  <div className="min-w-[24px] h-6 flex items-center justify-center bg-slate-800 rounded text-xs font-mono text-slate-500 mr-3">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                      {chunk.web?.title || "Untitled Result"}
                    </p>
                    <a href={chunk.web?.uri} target="_blank" rel="noreferrer" className="text-xs text-slate-500 truncate hover:text-indigo-400 block">
                      {chunk.web?.uri}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm italic">No source data returned from search grounding.</div>
            )}
          </div>
        </div>
      </div>

       {/* Visualization Section - Only if we have some competitors or data */}
       {chartData.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">SERP Composition</h3>
            <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={150} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#818cf8' }}
                      cursor={{fill: '#334155', opacity: 0.2}}
                    />
                    <Bar dataKey="position" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.type === 'target' ? '#10b981' : '#6366f1'} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              *Visual representation of domains found in the top search results.
            </p>
          </div>
       )}

      {/* Raw JSON Toggle */}
      <div className="border-t border-slate-800 pt-6">
        <button
          onClick={() => setShowJson(!showJson)}
          className="flex items-center text-sm text-slate-500 hover:text-indigo-400 transition-colors"
        >
          <Code className="h-4 w-4 mr-2" />
          {showJson ? 'Hide Raw JSON' : 'Show Raw JSON Output'}
        </button>
        
        {showJson && (
          <div className="mt-4 bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800">
            <pre className="text-xs font-mono text-emerald-400">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};

export default ResultsDisplay;