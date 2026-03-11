const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Configurar Socket.io con CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3001;

// Contador de conexiones
let connectionCount = 0;

io.on("connection", (socket) => {
  connectionCount++;
  console.log(
    `✅ Usuario conectado: ${socket.id} | Total conexiones: ${connectionCount}`,
  );

  // Escuchar mensajes
  socket.on("message", (msg) => {
    console.log(`📨 Mensaje recibido: ${msg}`);
    // Reenviar a todos los clientes (incluyendo el emisor)
    io.emit("message", msg);
  });

  // Escuchar desconexión
  socket.on("disconnect", () => {
    connectionCount--;
    console.log(
      `❌ Usuario desconectado: ${socket.id} | Total conexiones: ${connectionCount}`,
    );
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor Socket.io corriendo en http://localhost:${PORT}`);
});
