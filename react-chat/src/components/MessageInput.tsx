import React, { useState, FormEvent } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        disabled={disabled}
        style={{
          flex: 1,
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "14px",
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        style={{
          padding: "10px 20px",
          backgroundColor: disabled || !message.trim() ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: disabled || !message.trim() ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        Enviar
      </button>
    </form>
  );
};
