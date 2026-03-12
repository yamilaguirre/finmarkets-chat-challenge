import React, { useEffect, useRef } from "react";
import { Avatar } from "./Avatar";

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

  // Parsear el mensaje para extraer username y texto
  const parseMessage = (content: string) => {
    const match = content.match(/^(.+?):\s*(.+)$/);
    if (match) {
      return {
        username: match[1],
        text: match[2],
      };
    }
    return {
      username: "Anónimo",
      text: content,
    };
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        height: "400px",
        overflowY: "auto",
        backgroundColor: "#f5f5f5",
        marginBottom: "15px",
      }}
    >
      {messages.length === 0 ? (
        <div style={{ color: "#999", textAlign: "center", marginTop: "20px" }}>
          No hay mensajes aún. Escribe el primero.
        </div>
      ) : (
        messages.map((message) => {
          const { username, text } = parseMessage(message.content);
          return (
            <div
              key={message.id}
              style={{
                display: "flex",
                gap: "12px",
                padding: "12px",
                marginBottom: "12px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.2s",
              }}
            >
              <Avatar username={username} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "14px",
                    }}
                  >
                    {username}
                  </span>
                  <span style={{ fontSize: "11px", color: "#999" }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    wordWrap: "break-word",
                    lineHeight: "1.4",
                  }}
                >
                  {text}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
