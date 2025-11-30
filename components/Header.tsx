import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { GradeLevel } from '../types';

interface HeaderProps {
  topic: string;
  setTopic: (v: string) => void;
  grade: string;
  setGrade: (v: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  topic, setTopic, grade, setGrade, onGenerate, isLoading 
}) => {
  return (
    <header className="bg-red-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-400 p-2 rounded-full text-red-900">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider handwritten-font">小报助手</h1>
            <p className="text-xs text-red-200 opacity-90">手抄报生成神器</p>
          </div>
        </div>

        {/* Input Area (Inline for larger screens) */}
        <div className="hidden md:flex items-center space-x-3 bg-red-900/50 p-1.5 rounded-lg border border-red-700/50">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="输入主题 (例如: 宪法在我心中)" 
            className="bg-transparent border-none text-white placeholder-red-300 text-sm px-3 focus:outline-none w-64"
          />
          <div className="w-px h-4 bg-red-600/50"></div>
          <select 
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="bg-transparent border-none text-white text-sm px-2 focus:outline-none cursor-pointer"
          >
            {Object.values(GradeLevel).map(g => (
              <option key={g} value={g} className="text-stone-800">{g}</option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button 
          onClick={onGenerate}
          disabled={isLoading || !topic}
          className={`
            flex items-center space-x-2 px-6 py-2 rounded-full font-bold text-sm shadow-md transition-all
            ${isLoading 
              ? 'bg-stone-400 text-stone-200 cursor-not-allowed' 
              : 'bg-yellow-400 text-red-900 hover:bg-yellow-300 hover:scale-105 active:scale-95'}
          `}
        >
          {isLoading ? (
            <span>生成中...</span>
          ) : (
            <>
              <Sparkles size={16} />
              <span>一键生成手抄报</span>
            </>
          )}
        </button>
      </div>
      
      {/* Mobile Input Fallback */}
      <div className="md:hidden bg-red-900 p-3 space-y-2">
         <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="输入主题..." 
            className="w-full bg-red-950/50 rounded px-3 py-2 text-white text-sm focus:outline-none"
          />
           <select 
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full bg-red-950/50 rounded px-3 py-2 text-white text-sm focus:outline-none"
          >
            {Object.values(GradeLevel).map(g => (
              <option key={g} value={g} className="text-stone-800">{g}</option>
            ))}
          </select>
      </div>
    </header>
  );
};
