import { GoogleGenAI, Type } from "@google/genai";
import { CharacterCard } from "../types";

// Initialize Gemini Client
// Note: In a production app, ensure the key is restricted or proxied.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCharacterCard = async (card: CharacterCard): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      你是一位资深的二次元角色鉴赏家和文案大师。
      请根据以下角色卡信息，写一段吸引人的、充满高级感的中文介绍。
      
      角色名称: ${card.name}
      角色描述: ${card.description}
      性格特征: ${card.personality}
      开场白: ${card.first_mes}
      
      要求：
      1. 语气优雅、神秘或充满科技感（根据角色设定调整）。
      2. 100字左右。
      3. 不要包含Markdown标题。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "暂无法生成分析。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI 链接中断，无法获取深度分析。";
  }
};

export const chatWithCharacter = async (card: CharacterCard, userMessage: string, history: {role: string, content: string}[]): Promise<string> => {
    try {
        const systemInstruction = `
        你正在扮演一个角色。请完全沉浸在设定中。
        
        角色设定:
        Name: ${card.name}
        Description: ${card.description}
        Personality: ${card.personality}
        First Message: ${card.first_mes}
        Scenario: ${card.scenario || 'None'}
        
        只回复角色的台词和动作。不要跳出角色。
        `;

        // Map history to Gemini format if needed, simplified here for single turn or simple context
        // Ideally we use chats.create but for simple stateless preview we can just use generateContent with context
        const prompt = `User: ${userMessage}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        
        return response.text || "...";

    } catch (error) {
        console.error("Chat Error:", error);
        return "(系统错误: 无法连接到神经云端)";
    }
}
