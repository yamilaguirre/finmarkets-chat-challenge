import React from "react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
}) => {
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
        color: isConnected ? "#155724" : "#721c24",
        borderRadius: "4px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: isConnected ? "#28a745" : "#dc3545",
        }}
      />
      <span style={{ fontWeight: "bold" }}>
        {isConnected ? "Conectado" : "Desconectado"}
      </span>
    </div>
  );
};
