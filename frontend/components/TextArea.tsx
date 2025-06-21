"use client";

import React from 'react';

interface TextAreaProps {
  text: string;
  setText: (text: string) => void;
}

const TextArea: React.FC<TextAreaProps> = ({ text, setText }) => {
  return (
    <div className="space-y-2">
      <label className="text-white font-medium text-lg drop-shadow-sm">Or paste your text here</label>
      <textarea
        value={text}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
        placeholder="Enter your text to summarize..."
        className="w-full h-48 p-4 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 resize-none transition-all duration-300 hover:bg-white/15 focus:bg-white/20"
      />
    </div>
  );
};

export default TextArea; 