export const RichChatInput = () => {
    // 调用我们的大脑逻辑
    const { text, textareaRef, handleInputChange, handleKeyDown } = useChatInput({
      onSend: (msg) => console.log("发送消息:", msg),
    });
  
    return (
      <div className="chat-container">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          rows={1}
        />
        <button onClick={() => {/* 调用发送逻辑 */}}>发送</button>
      </div>
    );
  };