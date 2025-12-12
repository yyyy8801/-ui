import React from 'react';
import { CharacterCard, CATEGORIES } from '../types';
import { Download, MessageSquare, Tag, Flame, User } from 'lucide-react';

interface CardGridProps {
  cards: CharacterCard[];
  onSelect: (card: CharacterCard) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, onSelect }) => {
  return (
    <div className="space-y-4">
      {cards.map((card) => {
        const categoryObj = CATEGORIES.find(c => c.id === card.category);
        const categoryLabel = categoryObj?.label.split('/')[0].trim() || '其他';
        const hasDesc = card.description && card.description.length > 0;
        const isR18 = card.category === 'r18';
        
        return (
          <div 
            key={card.id}
            onClick={() => onSelect(card)}
            className="group relative flex flex-col sm:flex-row bg-white dark:bg-[#0a0a0a]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 hover:border-primary/30 dark:hover:border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 cursor-pointer h-auto sm:h-44"
          >
             {/* Hover Glow Effect */}
             <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isR18 ? 'from-red-500/5 dark:from-red-900/10 via-transparent to-transparent' : 'from-primary/5 dark:from-primary/5 via-transparent to-transparent'}`} />

            {/* Left: Image (Fixed Ratio) */}
            <div className="w-full sm:w-36 h-32 sm:h-full shrink-0 relative overflow-hidden bg-gray-100 dark:bg-black">
               <img 
                 src={card.imageUrl} 
                 alt={card.name} 
                 className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
               />
               {/* Mobile Category Badge */}
               <div className="absolute top-2 left-2 sm:hidden">
                  <span className={`text-[10px] px-2 py-1 rounded-md border backdrop-blur-md shadow-lg font-bold ${isR18 ? 'bg-red-600 text-white border-red-500' : 'bg-white/90 text-gray-900 border-white/10 dark:bg-black/50 dark:text-white'}`}>
                      {categoryLabel}
                  </span>
               </div>
            </div>

            {/* Middle: Info */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0 relative z-10">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    {/* Desktop Category Badge */}
                    <span className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${
                        isR18 
                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' 
                        : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/5'
                    }`}>
                      {categoryLabel}
                    </span>
                    
                    <h3 className={`text-lg font-bold truncate transition-colors flex items-center gap-2 ${isR18 ? 'text-red-600 dark:text-red-100 group-hover:text-red-500' : 'text-gray-900 dark:text-gray-100 group-hover:text-primary'}`}>
                      {card.name}
                      {isR18 && <Flame className="w-4 h-4 text-red-500 animate-pulse" />}
                    </h3>

                    {/* Author Display */}
                    <div className="ml-auto flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/5">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[80px]">{card.author || '佚名'}</span>
                    </div>
                  </div>
                  
                  <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed font-light ${hasDesc ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600 italic'}`}>
                    {hasDesc ? card.description : "这个作者很懒....什么都没写"}
                  </p>
               </div>

               <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                  <Tag className="w-3 h-3 text-gray-400 dark:text-gray-600" />
                  <div className="flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade">
                    {card.tags.length > 0 ? card.tags.slice(0, 6).map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/5 whitespace-nowrap group-hover:border-gray-300 dark:group-hover:border-white/10 transition-colors">
                        #{tag}
                      </span>
                    )) : <span className="text-[10px] text-gray-400 dark:text-gray-700">无标签</span>}
                  </div>
               </div>
            </div>

            {/* Right: Actions */}
            <div className="border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex flex-row sm:flex-col items-center justify-center p-0 sm:p-2 sm:w-28 shrink-0 divide-x sm:divide-x-0 sm:divide-y divide-gray-100 dark:divide-white/5">
               <button 
                 onClick={(e) => { e.stopPropagation(); onSelect(card); }}
                 className="flex-1 sm:flex-none w-full h-10 sm:h-auto sm:py-3 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
               >
                 <MessageSquare className="w-4 h-4" />
                 <span>预览</span>
               </button>
               
               <button 
                 onClick={(e) => { 
                   e.stopPropagation(); 
                   // Download logic placeholder
                   onSelect(card);
                 }}
                 className="flex-1 sm:flex-none w-full h-10 sm:h-auto sm:py-3 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
               >
                 <Download className="w-4 h-4" />
                 <span>下载</span>
               </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};