import React, { useState, useRef, useEffect } from "react";
import "../styles/Chat.css";
import { FaPaperPlane, FaImage } from "react-icons/fa";

const Chat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text, image = null) => {
    if (text.trim() || image) {
      setMessages([...messages, { text, image, sender: "Me" }]);
      setInput("");
    }
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sendMessage("", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="chat-title">Chat </span>
        <button onClick={onClose} className="close-chat-btn">×</button>
      </div>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div className="chat-empty">No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === "Me" ? "you" : "other"}`}>
              {msg.text && <p>{msg.text}</p>}
              {msg.image && <img src={msg.image} alt="sent" className="chat-image" />}
            </div>
          ))
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => fileInputRef.current.click()}>
          <FaImage />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <button onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;