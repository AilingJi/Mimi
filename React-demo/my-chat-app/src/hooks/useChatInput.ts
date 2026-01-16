import { useState, useCallback, useRef } from 'react';

// 1. 定义接口，这就是我们给 AI 或同事定的“契约”
interface UseChatInputProps {
  maxHeight?: number;
  onSend: (content: string) => void;
}

export function useChatInput({ maxHeight = 200, onSend }: UseChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 2. 核心逻辑：自动调整高度（不触发 Layout Thrashing）
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto'; // 先重置，才能计算真实的 scrollHeight
      const newHeight = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${newHeight}px`;
    }
  }, [maxHeight]);

  // 3. 处理输入
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustHeight();
  };

  // 4. 处理发送（快捷键 Enter）
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) {
        onSend(text);
        setText(''); // 清空
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
      }
    }
  };

  // 返回给 UI 使用的“弹药”
  return {
    text,
    textareaRef,
    handleInputChange,
    handleKeyDown,
  };
}