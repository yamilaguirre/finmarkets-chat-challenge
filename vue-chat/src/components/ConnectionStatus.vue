<template>
  <div
    :class="[
      'connection-status',
      { connected: isConnected, disconnected: !isConnected },
    ]"
  >
    <span class="status-icon" />
    <span class="status-text">{{
      isConnected ? "Conectado" : "Desconectado"
    }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isConnected: boolean;
}>();
</script>

<style scoped>
.connection-status {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.connected {
  background-color: #d4edda;
  color: #155724;
}

.disconnected {
  background-color: #f8d7da;
  color: #721c24;
}

.status-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.connected .status-icon {
  background-color: #28a745;
}

.disconnected .status-icon {
  background-color: #dc3545;
}

.status-text {
  font-weight: bold;
}
</style>
