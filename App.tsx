import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TextCard } from './components/TextCard';
import { generatePosterText, generatePosterImage } from './services/geminiService';
import { PosterState, GradeLevel } from './types';
import { Download, LayoutTemplate, MessageSquareQuote } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<PosterState>({
    topic: '宪法在我心中',
    grade: GradeLevel.JUNIOR,
    isLoading: false,
    generatedText: null,
    generatedImage: null,
    date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  });

  const handleGenerate = async () => {
    if (!state.topic) return;
    
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Parallel execution for speed
      const [textData, imageUrl] = await Promise.all([
        generatePosterText(state.topic, state.grade),
        generatePosterImage(state.topic, state.grade)
      ]);

      setState(prev => ({
        ...prev,
        isLoading: false,
        generatedText: textData,
        generatedImage: imageUrl
      }));
    } catch (error) {
      console.error("Generation failed:", error);
      alert("生成失败，请检查API Key配置或稍后重试。");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Initial load simulation or default empty state
  useEffect(() => {
    // Optional: Auto-generate on first load if we wanted, 
    // but better to let user choose.
  }, []);

  return (
    <div className="min-h-screen bg-graph-paper flex flex-col">
      <Header 
        topic={state.topic}
        setTopic={(t) => setState(prev => ({...prev, topic: t}))}
        grade={state.grade}
        setGrade={(g) => setState(prev => ({...prev, grade: g}))}
        onGenerate={handleGenerate}
        isLoading={state.isLoading}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        
        {/* Task Info Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-3 px-4 flex flex-wrap items-center gap-3 text-sm text-stone-600">
          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium text-xs">任务要求</span>
          <div className="flex items-center space-x-2">
             <span>A4 横版手绘</span>
             <span className="text-stone-300">•</span>
             <span>{state.date}</span>
             <span className="text-stone-300">•</span>
             <span className="font-medium text-stone-800">{state.topic}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Reference Image (8/12 width) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-2 rounded-xl shadow-md border-4 border-stone-800/5 relative overflow-hidden group">
              
              {/* Image Container with Aspect Ratio */}
              <div className="relative w-full aspect-[1.414/1] bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center">
                {state.isLoading ? (
                  <div className="flex flex-col items-center space-y-4 animate-pulse">
                     <LayoutTemplate size={48} className="text-stone-300" />
                     <p className="text-stone-400 font-medium">AI 正在构思布局...</p>
                  </div>
                ) : state.generatedImage ? (
                  <>
                    <img 
                      src={state.generatedImage} 
                      alt="Generated Layout" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-stone-900/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                      A4 横版设计参考
                    </div>
                  </>
                ) : (
                  <div className="text-center p-10">
                    <p className="text-stone-400 mb-2">点击上方“一键生成”开始制作</p>
                    <p className="text-xs text-stone-300">支持 Gemini Flash Image 模型</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar below Image */}
            <div className="flex justify-center">
              {state.generatedImage && (
                <a 
                  href={state.generatedImage} 
                  download={`poster-${state.topic}.png`}
                  className="flex items-center gap-2 text-stone-500 hover:text-red-700 transition-colors text-sm font-medium py-2"
                >
                  <Download size={16} />
                  下载参考图
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Text Material (4/12 width) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-md border border-stone-200 overflow-hidden">
              <div className="bg-white p-4 border-b border-stone-100 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="font-bold text-lg text-red-900 flex items-center gap-2">
                  <MessageSquareQuote className="text-blue-500" size={20} />
                  文字素材库
                </h2>
              </div>
              
              <div className="p-4 bg-stone-50 min-h-[500px] max-h-[800px] overflow-y-auto custom-scrollbar">
                {state.isLoading ? (
                  <div className="space-y-4">
                     {[1,2,3].map(i => (
                       <div key={i} className="h-32 bg-stone-200 rounded-lg animate-pulse"></div>
                     ))}
                  </div>
                ) : state.generatedText ? (
                  <>
                    <div className="mb-6">
                      <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mb-2 font-bold">标题</span>
                      <h1 className="text-4xl font-normal handwritten-font text-red-600 mb-1">{state.generatedText.title}</h1>
                    </div>

                    <TextCard 
                      title="卷首语"
                      subtitle="(INTRO)"
                      content={state.generatedText.intro}
                    />

                    <TextCard 
                      title="小知识"
                      subtitle="(FACTS)"
                      content={state.generatedText.facts}
                    />

                    <TextCard 
                      title="我与主题"
                      subtitle="(RELATIONS)"
                      content={state.generatedText.relations}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                    <p>等待生成文字内容...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;