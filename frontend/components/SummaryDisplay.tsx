"use client";

import React from 'react';

interface SummaryDisplayProps {
  summary: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="font-semibold text-xl text-white mb-4 drop-shadow-lg">Generated Summary</h3>
      <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm h-64 overflow-y-auto border border-white/10">
        {summary ? (
          <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{summary}</p>
        ) : (
          <p className="text-white/50 italic">Your summary will appear here...</p>
        )}
      </div>
      {summary && (
        <button
          onClick={handleDownload}
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          Download Summary
        </button>
      )}
    </div>
  );
};

export default SummaryDisplay; 