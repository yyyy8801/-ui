import React, { useState } from 'react';
import { Database, ArrowRight, AlertTriangle, Lock } from 'lucide-react';
import { Button } from './Button';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    } else {
      setError('请输入任意用户名和密码进入库房');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-10 p-10 group hover:border-white/20 transition-all duration-500">
        
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse-slow"></div>
            <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-xl">
              <Database className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">人民公用角色库</h1>
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-[0.2em] font-medium">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             System Online
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Identity</label>
            <input 
              type="text" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:bg-black/80 outline-none transition-all placeholder:text-gray-700"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Access Key</label>
            <input 
              type="password" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:bg-black/80 outline-none transition-all placeholder:text-gray-700"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-3 mt-4 text-sm font-bold tracking-wide shadow-lg shadow-primary/25" icon={<ArrowRight className="w-4 h-4"/>}>
            ACCESS ARCHIVE
          </Button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
           <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
             <Lock className="w-3 h-3" />
             <span className="text-[10px] font-medium uppercase tracking-wider">Secure Connection</span>
           </div>
           <p className="text-[10px] text-gray-700 leading-relaxed">
             本站仅提供角色卡片数据存储与解析服务。<br/>
             请遵守当地法律法规。18+ 内容请在分类中查看。
           </p>
        </div>
      </div>
    </div>
  );
};