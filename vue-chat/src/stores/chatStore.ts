import { defineStore } from "pinia";
import { ref } from "vue";
import { socketService } from "../services/socketService";
import { generateRandomUsername } from "../utils/userUtils";

interface Message {
  id: string;
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "chat-messages-vue";
const USERNAME_KEY = "chat-username-vue";

// Generar o recuperar username
const getOrCreateUsername = (): string => {
  const stored = localStorage.getItem(USERNAME_KEY);
  if (stored) return stored;

  const newUsername = generateRandomUsername();
  localStorage.setItem(USERNAME_KEY, newUsername);
  return newUsername;
};

export const useChatStore = defineStore("chat", () => {
  // State
  const messages = ref<Message[]>([]);
  const isConnected = ref(false);
  const username = ref(getOrCreateUsername());

  // Actions
  const addMessage = (content: string) => {
    const message: Message = {
      id: `${Date.now()}-${Math.random()}`,
      content,
      timestamp: Date.now(),
    };
    messages.value.push(message);
    saveMessages();
  };

  const setConnected = (connected: boolean) => {
    isConnected.value = connected;
  };

  const setUsername = (newUsername: string) => {
    username.value = newUsername;
    localStorage.setItem(USERNAME_KEY, newUsername);
  };

  const sendMessage = (content: string) => {
    const fullMessage = `${username.value}: ${content}`;
    socketService.sendMessage(fullMessage);
  };

  const loadMessages = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        messages.value = JSON.parse(stored);
      } catch (e) {
        console.error("Error al cargar mensajes:", e);
      }
    }
  };

  const saveMessages = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value));
  };

  return {
    // State
    messages,
    isConnected,
    username,
    // Actions
    addMessage,
    setConnected,
    setUsername,
    sendMessage,
    loadMessages,
    saveMessages,
  };
});
