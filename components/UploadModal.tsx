import React, { useState } from 'react';
import { Upload, X, FileJson, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { CharacterCard, CATEGORIES } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (card: CharacterCard) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('other');
  const [error, setError] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/json" && !file.name.endsWith('.json')) {
        setError("请上传有效的 JSON 文件");
        return;
      }
      setJsonFile(file);
      setError(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("请上传有效的图片文件 (PNG/JPG)");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const processFiles = async () => {
    if (!jsonFile || !imageFile || !imagePreview) {
      setError("请确保同时上传了 JSON 数据和图片文件。");
      return;
    }

    try {
      const text = await jsonFile.text();
      const data = JSON.parse(text);
      
      let charData = data;
      if (data.data && data.spec) {
        charData = data.data;
      } else if (data.character_book) {
          charData = data;
      }

      const name = charData.name || "未知角色";
      const description = charData.description || charData.scenario || "暂无描述";
      // Try to find author in various common fields
      const author = charData.creator || charData.author || charData.create_by || data.creator || "佚名";
      
      const newCard: CharacterCard = {
        id: crypto.randomUUID(),
        name,
        description,
        personality: charData.personality || "",
        first_mes: charData.first_mes || "",
        scenario: charData.scenario,
        creator_notes: charData.creator_notes,
        tags: charData.tags || [],
        category, // Use selected category
        imageUrl: imagePreview,
        originalJson: text,
        createDate: Date.now(),
        author: author
      };

      onUpload(newCard);
      onClose();
    } catch (err) {
      console.error(err);
      setError("解析 JSON 文件失败，请检查文件格式。");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300">
        
        <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#0f0f0f]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            录入角色档案
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">选择角色分类</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`text-xs py-2.5 px-2 rounded-lg border transition-all font-medium ${
                    category === cat.id 
                    ? cat.id === 'r18' 
                      ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-500/20 dark:border-red-500 dark:text-red-400' 
                      : 'bg-primary/10 border-primary text-primary dark:bg-primary/20 dark:border-primary dark:text-white'
                    : 'bg-white dark:bg-[#151515] border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#202020]'
                  }`}
                >
                  {cat.label.split('/')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
             {/* JSON Upload Box */}
             <div className="flex-1">
                <input type="file" accept=".json" onChange={handleJsonChange} className="hidden" id="json-upload"/>
                <label htmlFor="json-upload" className={`h-40 w-full border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${jsonFile ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-[#151515] dark:hover:bg-[#1a1a1a]'}`}>
                    {jsonFile ? (
                        <>
                          <FileJson className="w-8 h-8 text-primary mb-3" />
                          <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[80%]">{jsonFile.name}</span>
                          <div className="flex items-center gap-1 text-xs text-primary mt-1"><CheckCircle className="w-3 h-3"/> 已加载</div>
                        </>
                    ) : (
                        <>
                          <FileJson className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-3" />
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">点击上传 JSON</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">角色设定数据</span>
                        </>
                    )}
                </label>
             </div>

             {/* Image Upload Box */}
             <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="img-upload"/>
                <label htmlFor="img-upload" className={`h-40 w-full border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden ${imageFile ? 'border-primary' : 'border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-500 dark:bg-[#151515] dark:hover:bg-[#1a1a1a]'}`}>
                    {imagePreview ? (
                        <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    ) : null}

                    <div className="relative z-10 flex flex-col items-center">
                        {imageFile ? (
                           <>
                              <ImageIcon className="w-8 h-8 text-gray-900 dark:text-white mb-3 drop-shadow-md" />
                              <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[80%] drop-shadow-md">{imageFile.name}</span>
                              <div className="flex items-center gap-1 text-xs text-gray-900 dark:text-white mt-1 drop-shadow-md"><CheckCircle className="w-3 h-3"/> 已加载</div>
                           </>
                        ) : (
                           <>
                              <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-3" />
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">点击上传封面</span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">PNG / JPG</span>
                           </>
                        )}
                    </div>
                </label>
             </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-xl p-4 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0f0f0f] flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button onClick={processFiles} disabled={!jsonFile || !imageFile}>确认导入数据库</Button>
        </div>
      </div>
    </div>
  );
};