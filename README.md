# Chat en Tiempo Real - Prueba Técnica Finmarkets

Sistema de chat en tiempo real multi-framework construido con Socket.io, React y Vue 3. Implementación profesional que demuestra comunicación bidireccional en tiempo real, gestión de estado moderna y arquitectura escalable.

## Características Principales

- **Comunicación en Tiempo Real**: Sincronización instantánea de mensajes entre todas las aplicaciones conectadas
- **Multi-Framework**: Dos clientes independientes (React y Vue 3) que se comunican entre sí
- **Persistencia Local**: Los mensajes se guardan automáticamente en localStorage
- **Auto-Scroll Inteligente**: Desplazamiento automático a nuevos mensajes
- **Indicadores de Conexión**: Estado visual en tiempo real de la conexión al servidor
- **Generación Automática de Usuarios**: Nombres aleatorios para identificación rápida
- **Arquitectura Singleton**: Prevención de conexiones duplicadas con patrón singleton
- **TypeScript**: Tipado fuerte en todo el código para mayor confiabilidad
- **Reconexión Automática**: Manejo resiliente de desconexiones

## Arquitectura del Sistema

### Visión General

```
┌─────────────────────┐         ┌─────────────────────┐
│   React Client      │         │    Vue 3 Client     │
│  (Port 5173)        │         │   (Port 5176)       │
│                     │         │                     │
│  Zustand Store      │         │   Pinia Store       │
│  Socket Service     │         │   Socket Service    │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           │        WebSocket (Socket.io)  │
           │                               │
           └───────────────┬───────────────┘
                           │
                   ┌───────▼────────┐
                   │  Socket.io     │
                   │    Server      │
                   │  (Port 3001)   │
                   │                │
                   │  Broadcasting  │
                   └────────────────┘
```

### Patrón de Capas (3-Layer Architecture)

Cada cliente implementa una arquitectura de 3 capas claramente separadas:

1. **Capa de Servicio** (`services/socketService.ts`)
   - Gestión de conexión Socket.io
   - Patrón Singleton para evitar conexiones duplicadas
   - Manejo de listeners y cleanup
   - Configuración de reconexión automática

2. **Capa de Estado** (`store/`)
   - React: Zustand para gestión de estado global
   - Vue 3: Pinia con Composition API
   - Sincronización con localStorage
   - Lógica de negocio centralizada

3. **Capa de Presentación** (`components/`)
   - Componentes UI desacoplados del estado
   - Comunicación mediante props y eventos
   - Estilos modulares con scoped CSS

### Componentes del Sistema

#### Servidor Socket.io (`/server`)

- **Tecnologías**: Node.js, Express, Socket.io
- **Puerto**: 3001
- **Funcionalidad**:
  - Gestión de conexiones WebSocket
  - Broadcasting de mensajes a todos los clientes
  - Contador de usuarios activos
  - CORS configurado para desarrollo

#### Cliente React (`/react-chat`)

- **Tecnologías**: Vite 7.3.1, React 18, TypeScript, Zustand
- **Puerto**: 5173
- **Componentes**:
  - `ChatWindow`: Contenedor principal, gestión de ciclo de vida
  - `ConnectionStatus`: Indicador visual de conexión
  - `MessageList`: Lista de mensajes con auto-scroll
  - `MessageInput`: Formulario de envío de mensajes

#### Cliente Vue 3 (`/vue-chat`)

- **Tecnologías**: Vite 7.3.1, Vue 3, TypeScript, Pinia
- **Puerto**: 5176
- **Componentes**:
  - `ChatWindow.vue`: Contenedor con lifecycle hooks
  - `ConnectionStatus.vue`: Estado de conexión reactivo
  - `MessageList.vue`: Renderizado reactivo con watch
  - `MessageInput.vue`: Input controlado con v-model

## Instalación

### Requisitos Previos

- Node.js 18+ y npm
- Git

### Clonar el Repositorio

```bash
git clone https://github.com/yamilaguirre/finmarkets-chat-challenge.git
cd finmarkets-chat-challenge
```

### Instalar Dependencias

```bash
# Servidor
cd server
npm install

# Cliente React
cd ../react-chat
npm install

# Cliente Vue
cd ../vue-chat
npm install
```

## Ejecución del Sistema

Es necesario ejecutar las tres aplicaciones simultáneamente en terminales diferentes.

### 1. Iniciar el Servidor

```bash
cd server
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

### 2. Iniciar Cliente React

```bash
cd react-chat
npm run dev
```

La aplicación React estará disponible en `http://localhost:5173`

### 3. Iniciar Cliente Vue

```bash
cd vue-chat
npm run dev
```

La aplicación Vue estará disponible en `http://localhost:5176`

## Uso de la Aplicación

1. Abre ambos clientes en diferentes pestañas del navegador
2. Automáticamente se te asignará un nombre de usuario aleatorio
3. Escribe un mensaje en cualquier cliente y presiona Enter o haz clic en "Enviar"
4. El mensaje aparecerá INMEDIATAMENTE en ambos clientes
5. Los mensajes se guardan automáticamente en localStorage
6. El indicador de conexión muestra el estado en tiempo real

## Decisiones Técnicas

### Patrón Singleton para Socket Service

**Problema**: Múltiples instancias de conexión Socket.io causan duplicación de mensajes y desperdicio de recursos.

**Solución**: Implementación de patrón Singleton que garantiza una única instancia de socket por aplicación.

```typescript
class SocketService {
  private static instance: SocketService;
  private socket: Socket;

  private constructor() {
    this.socket = io('http://localhost:3001', { ... });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
}
```

### Gestión de Estado Global

**React**: Zustand fue elegido por su simplicidad (1KB), API moderna con hooks y excelente integración con TypeScript.

**Vue 3**: Pinia es el gestor de estado oficial de Vue 3, con soporte nativo para Composition API y DevTools.

### Persistencia con localStorage

Los mensajes se guardan automáticamente en localStorage con claves separadas:

- React: `chat-messages-react`
- Vue: `chat-messages-vue`

Esto permite mantener historiales independientes y evitar conflictos.

### Reconexión Automática

Configuración de Socket.io para manejar desconexiones:

```typescript
{
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket']
}
```

## Testing

### Test de Múltiples Usuarios

El servidor incluye un script de prueba que simula 3 usuarios simultáneos:

```bash
cd server
node test-multiples-usuarios.js
```

Este script crea 3 conexiones (Juan, María, Carlos) y simula una conversación automatizada.

## Estructura de Archivos

```
finmarkets-chat-challenge/
│
├── server/
│   ├── index.js                     # Servidor Socket.io principal
│   ├── test-cliente.js              # Test de un solo cliente
│   ├── test-multiples-usuarios.js   # Test de múltiples usuarios
│   └── package.json
│
├── react-chat/
│   └── src/
│       ├── components/
│       │   ├── ChatWindow.tsx
│       │   ├── ConnectionStatus.tsx
│       │   ├── MessageList.tsx
│       │   └── MessageInput.tsx
│       ├── services/
│       │   └── socketService.ts     # Singleton Socket.io
│       ├── store/
│       │   └── chatStore.ts         # Zustand store
│       ├── types/
│       │   └── index.ts
│       └── main.tsx
│
└── vue-chat/
    └── src/
        ├── components/
        │   ├── ChatWindow.vue
        │   ├── ConnectionStatus.vue
        │   ├── MessageList.vue
        │   └── MessageInput.vue
        ├── services/
        │   └── socketService.ts     # Singleton Socket.io
        ├── stores/
        │   └── chatStore.ts         # Pinia store
        ├── types/
        │   └── index.ts
        └── main.ts
```

## Tecnologías Utilizadas

### Backend

- Node.js - Runtime de JavaScript
- Express - Framework web minimalista
- Socket.io - Biblioteca WebSocket para comunicación bidireccional
- CORS - Manejo de Cross-Origin Resource Sharing

### Frontend React

- React 18 - Biblioteca UI
- TypeScript - Tipado estático
- Vite 7.3.1 - Build tool moderno
- Zustand - Gestión de estado (1KB)
- socket.io-client - Cliente WebSocket

### Frontend Vue

- Vue 3 - Framework progresivo
- TypeScript - Tipado estático
- Vite 7.3.1 - Build tool moderno
- Pinia - Gestión de estado oficial Vue 3
- socket.io-client - Cliente WebSocket

## Git Workflow

El proyecto utiliza Git Flow con branches protegidos:

- `main` - Rama principal de producción
- `feature/socket-server` - Implementación del servidor
- `feature/socket-service` - Servicio singleton
- `feature/react-chat` - Cliente React
- `feature/vue-chat` - Cliente Vue

Todas las ramas se conservan para documentación y referencia histórica.

## Características de Calidad del Código

- **TypeScript en todos los proyectos** - Prevención de errores en tiempo de compilación
- **Código sin emojis** - Estándares profesionales en logs y comentarios
- **Separación de responsabilidades** - Arquitectura de 3 capas
- **Patrones de diseño** - Singleton, Observer (via Socket.io)
- **Clean Code** - Nombres descriptivos, funciones pequeñas
- **Gestión de memoria** - Cleanup de listeners en unmount

## Próximas Mejoras

- [ ] Implementar autenticación de usuarios
- [ ] Agregar sistema de salas/canales
- [ ] Implementar indicadores de "escribiendo..."
- [ ] Agregar notificaciones de escritorio
- [ ] Deployar a producción con Docker
- [ ] Agregar tests unitarios y E2E
- [ ] Implementar base de datos para persistencia
- [ ] Agregar soporte para archivos multimedia

## Autor

**Yamil Aguirre**

- GitHub: [@yamilaguirre](https://github.com/yamilaguirre)

## Licencia

Este proyecto fue desarrollado como parte de una prueba técnica para Finmarkets.

---

Desarrollado con profesionalismo para Finmarkets - Marzo 2026
