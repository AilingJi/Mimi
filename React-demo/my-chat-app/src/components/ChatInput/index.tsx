import { useChatInput } from './userChatInput.ts';
import './ChatInput.css'; // 如果你用了 CSS

export const ChatInput = () => {
  const { text, textareaRef, handleInputChange, handleKeyDown } = useChatInput({
    onSend: (msg) => alert(`发送成功: ${msg}`),
    maxHeight: 150,
  });

  return (
    <div className="chat-input-wrapper">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="输入消息，Enter 发送..."
      />
      <div className="status-bar">
        {text.length} / 100
      </div>
    </div>
  );
};