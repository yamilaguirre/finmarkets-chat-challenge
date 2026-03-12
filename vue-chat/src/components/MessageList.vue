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
      <div class="message-content">{{ message.content }}</div>
      <div class="message-time">{{ formatTime(message.timestamp) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

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
  border-radius: 4px;
  padding: 15px;
  height: 400px;
  overflow-y: auto;
  background-color: #f9f9f9;
  margin-bottom: 15px;
}

.empty-state {
  color: #999;
  text-align: center;
  margin-top: 20px;
}

.message-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 4px;
  border-left: 3px solid #42b883;
  word-wrap: break-word;
}

.message-content {
  font-size: 14px;
  color: #333;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}
</style>
