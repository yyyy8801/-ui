import React, { useState, useMemo, useEffect } from 'react';
import { CharacterCard, CATEGORIES } from './types';
import { CardGrid } from './components/CardGrid';
import { UploadModal } from './components/UploadModal';
import { DetailModal } from './components/DetailModal';
import { Button } from './components/Button';
import { Database, PlusCircle, Search, Menu, ChevronLeft, ChevronRight, LayoutGrid, Cpu, Sword, DoorOpen, Coffee, Wand2, Ghost, MoreHorizontal, Flame, Sun, Moon } from 'lucide-react';

const getIcon = (iconName: string) => {
  const icons: any = { LayoutGrid, Cpu, Sword, DoorOpen, Coffee, Wand2, Ghost, MoreHorizontal, Flame };
  const Icon = icons[iconName] || LayoutGrid;
  return <Icon className="w-4 h-4" />;
};

const App: React.FC = () => {
  const [cards, setCards] = useState<CharacterCard[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CharacterCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Theme State
  const [isDark, setIsDark] = useState(true);

  // Sidebar states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Apply Theme Effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleUpload = (newCard: CharacterCard) => {
    setCards(prev => [newCard, ...prev]);
    setActiveCategory(newCard.category); 
  };

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    // Initialize counts
    CATEGORIES.forEach(cat => counts[cat.id] = 0);
    
    // Set 'all' count
    counts['all'] = cards.length;

    // Count specific categories
    cards.forEach(card => {
        if (counts[card.category] !== undefined) {
            counts[card.category]++;
        } else {
            // Fallback for any mismatch
            if (!counts['other']) counts['other'] = 0;
            counts['other']++;
        }
    });
    return counts;
  }, [cards]);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || card.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [cards, searchTerm, activeCategory]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-200 font-sans overflow-hidden transition-colors duration-300">
      
      {/* Ambient Background Effects (Dark Mode Only) */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block">
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col glass-sidebar relative z-20 transition-all duration-300 ${isSidebarCollapsed ? 'w-24' : 'w-80'}`}
      >
        {/* Brand - Enlarged Title */}
        <div className={`h-24 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-8'} border-b border-gray-200 dark:border-white/5`}>
          {!isSidebarCollapsed ? (
            <h1 className="text-4xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 drop-shadow-sm whitespace-nowrap">
              人民角色库
            </h1>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
              <span className="font-black text-white text-2xl">人</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 overflow-x-hidden custom-scrollbar">
          {!isSidebarCollapsed && <div className="px-4 mb-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">分类索引</div>}
          
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const isR18 = cat.id === 'r18';
            const count = categoryCounts[cat.id] || 0;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-3'} py-3.5 transition-all duration-300 rounded-xl group relative overflow-hidden ${
                  isActive
                    ? isR18 
                      ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 shadow-sm' 
                      : 'bg-primary/10 text-primary dark:text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200'
                }`}
                title={isSidebarCollapsed ? `${cat.label} (${count})` : ''}
              >
                {/* Active Indicator Line */}
                {isActive && !isSidebarCollapsed && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${isR18 ? 'bg-red-500' : 'bg-primary'}`} />
                )}

                <div className={`${isR18 && !isActive ? 'text-red-500/70 group-hover:text-red-500' : ''}`}>
                  {getIcon(cat.icon)}
                </div>

                {!isSidebarCollapsed && (
                  <>
                    <span className={`text-base font-bold whitespace-nowrap truncate tracking-tight`}>{cat.label}</span>
                    <span className={`ml-auto text-[10px] border px-2 py-0.5 rounded-full transition-colors font-medium ${
                        isActive 
                        ? 'border-transparent bg-white/50 dark:bg-white/10' 
                        : 'bg-gray-100 border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/5 dark:text-gray-500'
                    }`}>
                        {count}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions / Collapse Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5 flex flex-col gap-3 bg-gray-50/50 dark:bg-black/20">
          <Button 
            onClick={() => setIsUploadOpen(true)} 
            className={`w-full justify-center shadow-lg shadow-primary/20 ${isSidebarCollapsed ? 'px-0' : ''}`}
            variant="primary"
            icon={<PlusCircle className="w-5 h-5" />}
          >
            {!isSidebarCollapsed && "上传新角色"}
          </Button>
          
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      {/* Mobile Sidebar (Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0a0a0a] transform transition-transform duration-300 md:hidden flex flex-col border-r border-gray-200 dark:border-white/10 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="h-24 flex items-center px-8 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 tracking-tight italic whitespace-nowrap">
              人民角色库
            </h1>
         </div>
         <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === cat.id 
                    ? cat.id === 'r18' ? 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                    {getIcon(cat.icon)}
                    {cat.label}
                </div>
                <span className="text-xs opacity-50 bg-black/5 dark:bg-black/20 px-2 py-0.5 rounded">
                    {categoryCounts[cat.id] || 0}
                </span>
              </button>
            ))}
         </div>
         <div className="p-6 border-t border-gray-200 dark:border-white/10">
            <Button onClick={() => { setIsUploadOpen(true); setIsMobileMenuOpen(false); }} className="w-full py-3" icon={<PlusCircle className="w-5 h-5" />}>
              上传角色
            </Button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
        {/* Top Bar */}
        <header className="h-24 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-8 bg-white/60 dark:bg-black/20 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-4">
             <button className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
             </button>
             <h2 className={`text-2xl font-bold flex items-center gap-3 ${activeCategory === 'r18' ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}>
               {CATEGORIES.find(c => c.id === activeCategory)?.label}
               <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
                 {filteredCards.length}
               </span>
             </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="group hidden sm:flex items-center bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-full px-5 py-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 w-48 md:w-80 transition-all duration-300 shadow-sm">
              <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="检索档案 ID、名称..." 
                className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Theme Toggle Button */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:border-primary/30 transition-all shadow-sm"
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Scrollable List Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar flex flex-col">
           {cards.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 animate-in fade-in duration-700">
               <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center justify-center mb-6 shadow-xl">
                 <Database className="w-10 h-10 text-gray-400 dark:text-gray-600" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-2">库房空置 (Empty Archive)</h3>
               <p className="text-sm mb-8 max-w-sm text-center leading-relaxed text-gray-500">
                 当前分类下暂无档案。请点击下方按钮录入第一份数据。
               </p>
               <Button onClick={() => setIsUploadOpen(true)} variant="primary" size="lg" className="shadow-lg shadow-primary/20">
                 录入数据
               </Button>
             </div>
           ) : filteredCards.length === 0 ? (
             <div className="text-center py-20 text-gray-500">
               未检索到相关档案...
             </div>
           ) : (
             <CardGrid cards={filteredCards} onSelect={setSelectedCard} />
           )}

           {/* Footer / Copyright */}
           <div className="mt-auto pt-10 pb-6 text-center border-t border-gray-200 dark:border-white/5 mt-8">
              <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest hover:text-gray-500 transition-colors cursor-default">
                © 人民角色库 People's Character Repository
                <br />
                <span className="normal-case opacity-50 mt-1 block">
                  本站所有资源均由网友上传分享，仅供学习交流。<br/>如果不慎侵犯了您的权益，请联系管理员删除。
                </span>
              </p>
           </div>
        </main>
      </div>

      {/* Modals */}
      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={handleUpload} 
        />
      )}

      {selectedCard && (
        <DetailModal 
          card={selectedCard} 
          onClose={() => setSelectedCard(null)} 
        />
      )}
    </div>
  );
};

export default App;