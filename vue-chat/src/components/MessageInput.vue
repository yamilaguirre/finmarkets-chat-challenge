<template>
  <form @submit.prevent="handleSubmit" class="message-input-form">
    <input
      v-model="message"
      type="text"
      placeholder="Escribe un mensaje..."
      :disabled="disabled"
      class="message-input"
    />
    <button
      type="submit"
      :disabled="disabled || !message.trim()"
      class="send-button"
      :class="{ disabled: disabled || !message.trim() }"
    >
      Enviar
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  disabled: boolean;
}>();

const emit = defineEmits<{
  sendMessage: [message: string];
}>();

const message = ref("");

const handleSubmit = () => {
  if (message.value.trim() && !props.disabled) {
    emit("sendMessage", message.value.trim());
    message.value = "";
  }
};
</script>

<style scoped>
.message-input-form {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.message-input:focus {
  border-color: #42b883;
}

.send-button {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.send-button:hover:not(.disabled) {
  background-color: #359268;
}

.send-button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
