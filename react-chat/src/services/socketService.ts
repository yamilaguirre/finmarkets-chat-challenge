import { io, Socket } from "socket.io-client";

type MessageCallback = (message: string) => void;
type ConnectionCallback = (connected: boolean) => void;
type ErrorCallback = (error: SocketError) => void;

interface SocketError {
  type: "CONNECTION_ERROR" | "RECONNECTION_FAILED" | "SEND_ERROR";
  message: string;
  originalError?: Error;
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

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
      this.reconnectAttempts = 0;
      this.emit("connection", true);
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("Desconectado del servidor. Razón:", reason);
      this.emit("connection", false);
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("Error de conexión:", error.message);
      this.emit("error", {
        type: "CONNECTION_ERROR",
        message:
          "No se pudo conectar al servidor. Verifica que el servidor esté corriendo.",
        originalError: error,
      } as SocketError);
    });

    this.socket.on("reconnect_attempt", (attemptNumber: number) => {
      this.reconnectAttempts = attemptNumber;
      console.log(
        `Intento de reconexión ${attemptNumber}/${this.maxReconnectAttempts}`,
      );
    });

    this.socket.on("reconnect_error", (error: Error) => {
      console.error("Error en reconexión:", error.message);
    });

    this.socket.on("reconnect_failed", () => {
      console.error(
        `Falló la reconexión después de ${this.maxReconnectAttempts} intentos`,
      );
      this.emit("error", {
        type: "RECONNECTION_FAILED",
        message: `No se pudo reconectar después de ${this.maxReconnectAttempts} intentos. Por favor, recarga la página.`,
      } as SocketError);
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
      const error: SocketError = {
        type: "SEND_ERROR",
        message: "No se puede enviar el mensaje. Socket no conectado.",
      };
      console.error(error.message);
      this.emit("error", error);
      return;
    }

    try {
      this.socket.emit("message", message);
    } catch (error) {
      const socketError: SocketError = {
        type: "SEND_ERROR",
        message: "Error al enviar el mensaje",
        originalError: error as Error,
      };
      console.error(socketError.message, error);
      this.emit("error", socketError);
    }
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
   * Escuchar errores
   */
  onError(callback: ErrorCallback): () => void {
    return this.on("error", callback);
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
