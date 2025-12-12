export interface CharacterCard {
  id: string;
  name: string;
  description: string;
  personality: string;
  first_mes: string;
  scenario?: string;
  creator_notes?: string;
  tags: string[];
  category: string; 
  imageUrl: string; // Base64 or URL
  originalJson: string; // The full JSON content string
  createDate: number;
  author: string; // New field for author name
}

export interface UploadedFile {
  file: File;
  content: string | ArrayBuffer | null;
  type: 'json' | 'image';
}

export enum ViewMode {
  GRID = 'GRID',
  DETAIL = 'DETAIL',
  UPLOAD = 'UPLOAD'
}

export interface GeminiAnalysis {
  summary: string;
  rating: number; // 1-5
  suggestedTags: string[];
}

export const CATEGORIES = [
  { id: 'all', label: '全部角色', icon: 'LayoutGrid' },
  { id: 'r18', label: '18+ / 限制级', icon: 'Flame' }, // New Category
  { id: 'scifi', label: '科幻 / 赛博', icon: 'Cpu' },
  { id: 'cultivation', label: '修仙 / 玄幻', icon: 'Sword' },
  { id: 'isekai', label: '穿越 / 异世界', icon: 'DoorOpen' },
  { id: 'daily', label: '日常 / 恋爱', icon: 'Coffee' },
  { id: 'fantasy', label: '西幻 / 魔法', icon: 'Wand2' },
  { id: 'horror', label: '怪谈 / 恐怖', icon: 'Ghost' },
  { id: 'other', label: '其他', icon: 'MoreHorizontal' },
];