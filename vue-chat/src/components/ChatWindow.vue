<template>
  <div class="chat-window">
    <h1 class="title">Chat en Tiempo Real - Vue 3</h1>

    <div class="username-display">
      Usuario: <strong>{{ username }}</strong>
    </div>

    <ConnectionStatus :is-connected="isConnected" />

    <MessageList :messages="messages" />

    <MessageInput :disabled="!isConnected" @send-message="handleSendMessage" />

    <div class="info-text">Los mensajes se guardan en localStorage</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore } from "../stores/chatStore";
import { socketService } from "../services/socketService";
import ConnectionStatus from "./ConnectionStatus.vue";
import MessageList from "./MessageList.vue";
import MessageInput from "./MessageInput.vue";

const chatStore = useChatStore();
const { messages, isConnected, username } = storeToRefs(chatStore);

let unsubscribeMessages: (() => void) | null = null;
let unsubscribeConnection: (() => void) | null = null;
let unsubscribeErrors: (() => void) | null = null;

onMounted(() => {
  // Cargar mensajes del localStorage
  chatStore.loadMessages();

  // Conectar al servidor
  socketService.connect();

  // Escuchar mensajes
  unsubscribeMessages = socketService.onMessage((msg: string) => {
    chatStore.addMessage(msg);
  });

  // Escuchar cambios de conexión
  unsubscribeConnection = socketService.onConnectionChange(
    (connected: boolean) => {
      chatStore.setConnected(connected);
    },
  );

  // Escuchar errores
  unsubscribeErrors = socketService.onError((error: any) => {
    console.error("[Error de Socket]", error.message);
    if (error.type === "RECONNECTION_FAILED") {
      alert(
        "No se pudo reconectar al servidor. Por favor, verifica que el servidor esté corriendo y recarga la página.",
      );
    }
  });
});

onUnmounted(() => {
  // Cleanup
  if (unsubscribeMessages) unsubscribeMessages();
  if (unsubscribeConnection) unsubscribeConnection();
  if (unsubscribeErrors) unsubscribeErrors();
});

const handleSendMessage = (message: string) => {
  chatStore.sendMessage(message);
};
</script>

<style scoped>
.chat-window {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.username-display {
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
}

.info-text {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
