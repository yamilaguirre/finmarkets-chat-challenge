import { io, Socket } from "socket.io-client";

type MessageCallback = (message: string) => void;
type ConnectionCallback = (connected: boolean) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Conectar al servidor Socket.io
   */
  connect(url: string = "http://localhost:3001"): void {
    if (this.socket?.connected) {
      console.log("Socket ya está conectado");
      return;
    }

    this.socket = io(url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("Conectado al servidor Socket.io");
      this.emit("connection", true);
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
      this.emit("connection", false);
    });

    this.socket.on("message", (msg: string) => {
      this.emit("message", msg);
    });
  }

  /**
   * Desconectar del servidor
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Enviar mensaje al servidor
   */
  sendMessage(message: string): void {
    if (!this.socket?.connected) {
      console.error("Socket no está conectado");
      return;
    }
    this.socket.emit("message", message);
  }

  /**
   * Escuchar mensajes
   */
  onMessage(callback: MessageCallback): () => void {
    return this.on("message", callback);
  }

  /**
   * Escuchar cambios de conexión
   */
  onConnectionChange(callback: ConnectionCallback): () => void {
    return this.on("connection", callback);
  }

  /**
   * Sistema interno de eventos
   */
  private on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Retornar función de cleanup
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emitir eventos internos
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Exportar instancia singleton
export const socketService = new SocketService();
