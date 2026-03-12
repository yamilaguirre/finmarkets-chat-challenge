import React from "react";

interface AvatarProps {
  username: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ username, size = 40 }) => {
  // Obtener inicial del nombre
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // Generar color basado en el nombre
  const getAvatarColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  const initial = getInitial(username);
  const backgroundColor = getAvatarColor(username);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: `${size * 0.5}px`,
        flexShrink: 0,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        userSelect: "none",
      }}
      title={username}
    >
      {initial}
    </div>
  );
};
