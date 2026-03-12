import React, { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { socketService } from "../services/socketService";
import { ConnectionStatus } from "./ConnectionStatus";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export const ChatWindow: React.FC = () => {
  const {
    messages,
    isConnected,
    username,
    addMessage,
    setConnected,
    sendMessage,
    loadMessages,
  } = useChatStore();

  useEffect(() => {
    // Cargar mensajes del localStorage
    loadMessages();

    // Conectar al servidor
    socketService.connect();

    // Escuchar mensajes
    const unsubscribeMessages = socketService.onMessage((msg: string) => {
      addMessage(msg);
    });

    // Escuchar cambios de conexión
    const unsubscribeConnection = socketService.onConnectionChange(
      (connected: boolean) => {
        setConnected(connected);
      },
    );

    // Cleanup al desmontar
    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Chat en Tiempo Real - React
      </h1>

      <div style={{ marginBottom: "10px", color: "#666", fontSize: "14px" }}>
        Usuario: <strong>{username}</strong>
      </div>

      <ConnectionStatus isConnected={isConnected} />

      <MessageList messages={messages} />

      <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />

      <div
        style={{
          marginTop: "10px",
          fontSize: "12px",
          color: "#999",
          textAlign: "center",
        }}
      >
        Los mensajes se guardan en localStorage
      </div>
    </div>
  );
};
