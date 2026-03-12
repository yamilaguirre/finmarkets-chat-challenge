<template>
  <div
    class="avatar"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: avatarColor,
      fontSize: `${size * 0.5}px`,
    }"
    :title="username"
  >
    {{ initial }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  username: string;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
});

// Obtener inicial del nombre
const initial = computed(() => {
  return props.username.charAt(0).toUpperCase();
});

// Generar color basado en el nombre
const avatarColor = computed(() => {
  let hash = 0;
  for (let i = 0; i < props.username.length; i++) {
    hash = props.username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
});
</script>

<style scoped>
.avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  user-select: none;
}
</style>
