import React, { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { socketService } from "../services/socketService";
import { ConnectionStatus } from "./ConnectionStatus";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Avatar } from "./Avatar";

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

    // Escuchar errores
    const unsubscribeErrors = socketService.onError((error: any) => {
      console.error("[Error de Socket]", error.message);
      if (error.type === "RECONNECTION_FAILED") {
        alert(
          "No se pudo reconectar al servidor. Por favor, verifica que el servidor esté corriendo y recarga la página.",
        );
      }
    });

    // Cleanup al desmontar
    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
      unsubscribeErrors();
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        padding: "0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
          color: "white",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            margin: "0 0 15px 0",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Chat en Tiempo Real - React
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            backgroundColor: "rgba(255,255,255,0.15)",
            padding: "10px 15px",
            borderRadius: "8px",
          }}
        >
          <Avatar username={username} size={36} />
          <div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>Conectado como</div>
            <strong style={{ fontSize: "16px" }}>{username}</strong>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px" }}>
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
    </div>
  );
};
