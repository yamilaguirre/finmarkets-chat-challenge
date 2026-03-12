<template>
  <div class="message-list" ref="messageContainer">
    <div v-if="messages.length === 0" class="empty-state">
      No hay mensajes aún. Escribe el primero.
    </div>
    <div
      v-else
      v-for="message in messages"
      :key="message.id"
      class="message-item"
    >
      <Avatar :username="parseMessage(message.content).username" :size="40" />
      <div class="message-body">
        <div class="message-header">
          <span class="message-username">{{
            parseMessage(message.content).username
          }}</span>
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
        <div class="message-content">
          {{ parseMessage(message.content).text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import Avatar from "./Avatar.vue";

interface Message {
  id: string;
  content: string;
  timestamp: number;
}

const props = defineProps<{
  messages: Message[];
}>();

const messageContainer = ref<HTMLDivElement>();

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

// Parsear el mensaje para extraer username y texto
const parseMessage = (content: string) => {
  const match = content.match(/^(.+?):\s*(.+)$/);
  if (match) {
    return {
      username: match[1],
      text: match[2],
    };
  }
  return {
    username: "Anónimo",
    text: content,
  };
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

watch(
  () => props.messages.length,
  () => {
    scrollToBottom();
  },
);
</script>

<style scoped>
.message-list {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  height: 400px;
  overflow-y: auto;
  background-color: #f5f5f5;
  margin-bottom: 15px;
}

.empty-state {
  color: #999;
  text-align: center;
  margin-top: 20px;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.message-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.message-body {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.message-username {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message-content {
  font-size: 14px;
  color: #555;
  word-wrap: break-word;
  line-height: 1.4;
}
</style>
