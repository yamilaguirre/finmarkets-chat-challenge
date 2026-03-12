import React, { useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "15px",
        height: "400px",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
        marginBottom: "15px",
      }}
    >
      {messages.length === 0 ? (
        <div style={{ color: "#999", textAlign: "center", marginTop: "20px" }}>
          No hay mensajes aún. Escribe el primero.
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            style={{
              padding: "8px 12px",
              marginBottom: "8px",
              backgroundColor: "white",
              borderRadius: "4px",
              borderLeft: "3px solid #007bff",
              wordWrap: "break-word",
            }}
          >
            <div style={{ fontSize: "14px", color: "#333" }}>
              {message.content}
            </div>
            <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
