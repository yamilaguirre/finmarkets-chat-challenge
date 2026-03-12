<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="chat-header">
      <h1 class="title">Chat en Tiempo Real - Vue 3</h1>

      <div class="user-info">
        <Avatar :username="username" :size="36" />
        <div class="user-details">
          <div class="user-label">Conectado como</div>
          <strong class="user-name">{{ username }}</strong>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="chat-body">
      <ConnectionStatus :is-connected="isConnected" />

      <MessageList :messages="messages" />

      <MessageInput
        :disabled="!isConnected"
        @send-message="handleSendMessage"
      />

      <div class="info-text">Los mensajes se guardan en localStorage</div>
    </div>
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
import Avatar from "./Avatar.vue";

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
.chat-container {
  max-width: 700px;
  margin: 30px auto;
  padding: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: white;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  padding: 20px;
  color: white;
}

.title {
  text-align: center;
  margin: 0 0 15px 0;
  font-size: 24px;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 10px 15px;
  border-radius: 8px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-label {
  font-size: 14px;
  opacity: 0.9;
}

.user-name {
  font-size: 16px;
}

.chat-body {
  padding: 20px;
}

.info-text {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
