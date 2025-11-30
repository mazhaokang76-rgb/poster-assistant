import React from 'react';

interface TextCardProps {
  title: string;
  subtitle: string; // e.g., (INTRO)
  content: string;
  colorClass?: string;
}

export const TextCard: React.FC<TextCardProps> = ({ title, subtitle, content, colorClass = "bg-white" }) => {
  return (
    <div className={`p-5 rounded-lg shadow-sm border border-stone-100 ${colorClass} mb-4 transition-all hover:shadow-md`}>
      <h3 className="font-bold text-stone-800 text-lg mb-2 flex items-baseline">
        {title} 
        <span className="ml-2 text-xs text-stone-400 uppercase font-normal tracking-wide">{subtitle}</span>
      </h3>
      <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
};