import { create } from "zustand";
import { socketService } from "../services/socketService";

interface Message {
  id: string;
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  username: string;
  addMessage: (content: string) => void;
  setConnected: (connected: boolean) => void;
  setUsername: (username: string) => void;
  sendMessage: (content: string) => void;
  loadMessages: () => void;
  saveMessages: () => void;
}

const STORAGE_KEY = "chat-messages";
const USERNAME_KEY = "chat-username";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isConnected: false,
  username:
    localStorage.getItem(USERNAME_KEY) ||
    `Usuario${Math.floor(Math.random() * 1000)}`,

  addMessage: (content: string) => {
    const message: Message = {
      id: `${Date.now()}-${Math.random()}`,
      content,
      timestamp: Date.now(),
    };
    set((state) => {
      const newMessages = [...state.messages, message];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
      return { messages: newMessages };
    });
  },

  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },

  setUsername: (username: string) => {
    localStorage.setItem(USERNAME_KEY, username);
    set({ username });
  },

  sendMessage: (content: string) => {
    const { username } = get();
    const fullMessage = `${username}: ${content}`;
    socketService.sendMessage(fullMessage);
  },

  loadMessages: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const messages = JSON.parse(stored);
        set({ messages });
      } catch (e) {
        console.error("Error al cargar mensajes:", e);
      }
    }
  },

  saveMessages: () => {
    const { messages } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  },
}));
