import React, { useState, useEffect } from 'react';
import { X, Download, MessageSquare, User, AlertCircle, Quote, Brain } from 'lucide-react';
import { Button } from './Button';
import { CharacterCard } from '../types';
import { chatWithCharacter } from '../services/geminiService';

interface DetailModalProps {
  card: CharacterCard;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ card, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'chat'>('info');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Initial chat setup
  useEffect(() => {
    if (card.first_mes && chatHistory.length === 0) {
      setChatHistory([{ role: 'model', text: card.first_mes }]);
    }
  }, [card]);

  const handleDownload = () => {
    const blob = new Blob([card.originalJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    const reply = await chatWithCharacter(card, userMsg, []); 
    
    setChatHistory(prev => [...prev, { role: 'model', text: reply }]);
    setChatLoading(false);
  };

  const hasDescription = card.description && card.description.trim().length > 0;
  const isR18 = card.category === 'r18';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full h-full md:h-[85vh] md:max-w-6xl bg-white dark:bg-[#0a0a0a] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-white/10 group transition-colors duration-300">
        
        {/* Mobile Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white md:hidden border border-white/10">
            <X className="w-5 h-5" />
        </button>

        {/* Left Sidebar: Image & Actions */}
        <div className="w-full md:w-96 bg-gray-50 dark:bg-[#050505] flex flex-col border-r border-gray-200 dark:border-white/5 shrink-0 relative transition-colors duration-300">
          <div className="aspect-[3/4] md:aspect-auto md:h-3/5 w-full relative bg-black overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#050505] to-transparent z-10 transition-colors duration-300" />
            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover opacity-90" />
            
            {/* R18 Badge Overlay */}
            {isR18 && (
                <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-red-400">
                    18+ RESTRICTED
                </div>
            )}
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-4 bg-gray-50 dark:bg-[#050505] relative z-20 -mt-10 md:mt-0 transition-colors duration-300">
             <div>
                <h2 className={`text-2xl font-bold leading-tight mb-2 ${isR18 ? 'text-red-600 dark:text-red-100' : 'text-gray-900 dark:text-white'}`}>{card.name}</h2>
                <div className="flex flex-wrap gap-2">
                     <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-white/5 uppercase tracking-wider">
                        {card.category || '未分类'}
                    </span>
                </div>
             </div>

             <div className="mt-auto space-y-3">
               <Button onClick={handleDownload} className="w-full py-3" variant="primary" icon={<Download className="w-4 h-4"/>}>
                 下载数据 (JSON)
               </Button>
               {card.creator_notes && (
                 <div className="text-xs text-gray-500 bg-white dark:bg-[#0f0f0f] p-4 rounded-xl border border-gray-200 dark:border-white/5 leading-relaxed">
                   <span className="font-bold block mb-1 text-gray-400 uppercase tracking-wider text-[10px]">Creator Notes</span>
                   {card.creator_notes}
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0a] min-w-0 transition-colors duration-300">
          {/* Header Tabs */}
          <div className="flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/5 h-16 bg-white/80 dark:bg-[#0a0a0a]/50 backdrop-blur-xl">
             <div className="flex h-full gap-6">
               <button 
                 onClick={() => setActiveTab('info')}
                 className={`h-full text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'info' ? 'border-primary text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
               >
                 <User className="w-4 h-4" />
                 档案信息
               </button>
               <button 
                 onClick={() => setActiveTab('chat')}
                 className={`h-full text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'chat' ? 'border-primary text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
               >
                 <MessageSquare className="w-4 h-4" />
                 预览对话
               </button>
             </div>
             <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
             </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white dark:bg-[#0a0a0a]">
            {activeTab === 'info' ? (
              <div className="space-y-8 max-w-3xl">
                
                {/* Description Block */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" /> 角色描述
                  </h3>
                  <div className={`p-6 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap font-light tracking-wide ${
                    hasDescription 
                      ? 'bg-gray-50 dark:bg-[#0f0f0f] border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300' 
                      : 'bg-gray-50 dark:bg-white/5 border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600 italic text-center py-8'
                  }`}>
                    {hasDescription ? card.description : "这个作者很懒....什么都没写"}
                  </div>
                </div>

                {/* Other Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Quote className="w-4 h-4" /> 开场白
                      </h3>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/5 text-xs text-gray-600 dark:text-gray-400 max-h-40 overflow-y-auto leading-relaxed">
                        {card.first_mes || "无"}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Brain className="w-4 h-4" /> 性格特征
                      </h3>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-white/5 text-xs text-gray-600 dark:text-gray-400 max-h-40 overflow-y-auto leading-relaxed">
                         {card.personality || "无"}
                      </div>
                    </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">标签索引</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.length > 0 ? card.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0f0f0f] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-colors">
                        #{tag}
                      </span>
                    )) : <span className="text-xs text-gray-400 dark:text-gray-700">无标签</span>}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col h-full mx-auto bg-gray-50 dark:bg-[#050505] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
                 {/* Chat Area */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                          msg.role === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-300 rounded-bl-none border border-gray-200 dark:border-white/5 shadow-sm'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                         <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-transparent rounded-2xl rounded-bl-none px-5 py-3 flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '100ms'}}></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
                         </div>
                      </div>
                    )}
                 </div>

                 {/* Input */}
                 <div className="p-4 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/5 flex gap-3">
                   <input
                     type="text"
                     className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                     placeholder="与角色对话..."
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                   />
                   <Button onClick={handleSendMessage} disabled={chatLoading || !chatInput.trim()} size="md" icon={<MessageSquare className="w-4 h-4" />}>
                     发送
                   </Button>
                 </div>
                 <div className="px-4 pb-2 text-center">
                    <p className="text-[10px] text-gray-400 dark:text-gray-600">预览模式 | AI 回复仅供参考</p>
                 </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};