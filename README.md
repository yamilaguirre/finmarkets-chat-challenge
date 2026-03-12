# Chat en Tiempo Real - Finmarkets

Sistema de chat en tiempo real que permite la comunicación bidireccional entre aplicaciones React y Vue 3 utilizando Socket.io. La implementación demuestra arquitectura de 3 capas, patrones de diseño modernos y gestión de estado con Zustand y Pinia.

## Tecnologías y Herramientas

### Backend

- **Node.js** - Entorno de ejecución JavaScript
- **Express 5.2.1** - Framework web minimalista
- **Socket.io 4.8.3** - Comunicación WebSocket bidireccional en tiempo real
- **CORS** - Habilitado para desarrollo local
- **Nodemon** - Recarga automática en desarrollo

### Frontend React

- **React 18** - Biblioteca para interfaces de usuario
- **TypeScript 5.6** - Tipado estático para JavaScript
- **Vite 7.3.1** - Build tool de nueva generación con HMR
- **Zustand 5.0** - Gestión de estado minimalista (1KB gzipped)
- **socket.io-client 4.8.3** - Cliente WebSocket

### Frontend Vue

- **Vue 3.5** - Framework progresivo para interfaces de usuario
- **TypeScript 5.6** - Tipado estático para JavaScript
- **Vite 7.3.1** - Build tool de nueva generación con HMR
- **Pinia 2.3** - Store oficial de Vue 3 con Composition API
- **socket.io-client 4.8.3** - Cliente WebSocket

## Arquitectura y Patrones

### Arquitectura de 3 Capas

El proyecto implementa una separación clara de responsabilidades en tres capas:

**1. Capa de Servicio (Services Layer)**

- Manejo de conexiones Socket.io mediante patrón Singleton
- Prevención de instancias duplicadas de socket
- Gestión de listeners y cleanup automático
- Configuración de reconexión automática (5 intentos, 1 segundo de delay)

**2. Capa de Estado (State Layer)**

- React: Zustand con API de hooks moderna
- Vue 3: Pinia con Composition API y reactivity system
- Sincronización automática con localStorage
- Lógica de negocio centralizada y testeable
- Separación de claves de storage por aplicación

**3. Capa de Presentación (Presentation Layer)**

- Componentes UI desacoplados del negocio
- 4 componentes modulares por aplicación
- Props drilling minimizado mediante stores
- Estilos con scoped CSS (Vue) y CSS modules (React)

### Patrón Singleton

Implementación del patrón Singleton en el servicio de Socket para garantizar una única instancia de conexión por aplicación:

```typescript
class SocketService {
  private static instance: SocketService;
  private socket: Socket;

  private constructor() {
    this.socket = io("http://localhost:3001", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
}
```

### Broadcasting con Socket.io

El servidor utiliza el método `io.emit()` para broadcasting de mensajes a todos los clientes conectados:

```javascript
socket.on("message", (msg) => {
  io.emit("message", msg); // Envía a TODOS los clientes
});
```

### Gestión de Estado Reactivo

**React con Zustand:**

```typescript
const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isConnected: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));
```

**Vue con Pinia:**

```typescript
export const useChatStore = defineStore("chat", () => {
  const messages = ref<Message[]>([]);
  const isConnected = ref(false);

  function addMessage(message: Message) {
    messages.value.push(message);
  }

  return { messages, isConnected, addMessage };
});
```

## Modularización del Código

### Servidor (`/server`)

```
server/
├── index.js                        # Servidor principal con Socket.io
├── test-cliente.js                 # Script de prueba para un cliente
├── test-multiples-usuarios.js      # Simulación de 3 usuarios concurrentes
└── package.json                    # Dependencias del servidor
```

### React (`/react-chat`)

```
react-chat/src/
├── components/
│   ├── ChatWindow.tsx             # Contenedor principal con useEffect
│   ├── ConnectionStatus.tsx       # Indicador de conexión
│   ├── MessageList.tsx            # Lista con auto-scroll y useRef
│   └── MessageInput.tsx           # Formulario de envío
├── services/
│   └── socketService.ts           # Singleton de Socket.io
├── store/
│   └── chatStore.ts               # Zustand store
├── types/
│   └── index.ts                   # Definiciones de TypeScript
└── main.tsx                       # Entry point
```

### Vue (`/vue-chat`)

```
vue-chat/src/
├── components/
│   ├── ChatWindow.vue             # Container con onMounted/onUnmounted
│   ├── ConnectionStatus.vue       # Estado reactivo
│   ├── MessageList.vue            # Watch y nextTick para scroll
│   └── MessageInput.vue           # v-model y emit
├── services/
│   └── socketService.ts           # Singleton de Socket.io
├── stores/
│   └── chatStore.ts               # Pinia store
├── types/
│   └── index.ts                   # Definiciones de TypeScript
└── main.ts                        # Entry point con createPinia()
```

## Características Implementadas

- Comunicación WebSocket bidireccional en tiempo real
- Broadcasting de mensajes entre React y Vue
- Persistencia local con localStorage (claves separadas)
- Auto-scroll inteligente en lista de mensajes
- Indicador visual de estado de conexión (Conectado/Desconectado)
- Generación automática de nombres de usuario
- Reconexión automática al servidor
- Timestamps en formato legible (HH:MM:SS)
- Tipado completo con TypeScript
- Manejo de errores y desconexiones

## Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- Node.js versión 18 o superior
- npm (viene incluido con Node.js)
- Git
- Un navegador web moderno (Chrome, Firefox, Edge, Safari)

Para verificar las versiones instaladas:

```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 9.x.x o superior
```

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/yamilaguirre/finmarkets-chat-challenge.git
cd finmarkets-chat-challenge
```

Resultado esperado:

```
Cloning into 'finmarkets-chat-challenge'...
remote: Enumerating objects: ...
remote: Counting objects: 100% (...)
Receiving objects: 100% (...)
Resolving deltas: 100% (...)
```

### Paso 2: Instalar Dependencias del Servidor

```bash
cd server
npm install
```

Resultado esperado:

```
added 150 packages, and audited 151 packages in 8s

23 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Dependencias instaladas:

- express (Framework HTTP)
- socket.io (WebSocket server)
- cors (Cross-Origin Resource Sharing)
- nodemon (Auto-reload en desarrollo)

### Paso 3: Instalar Dependencias del Cliente React

```bash
cd ../react-chat
npm install
```

Resultado esperado:

```
added 285 packages, and audited 286 packages in 12s

92 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Dependencias instaladas:

- react y react-dom (Framework UI)
- typescript (Tipado estático)
- vite (Build tool)
- zustand (State management)
- socket.io-client (Cliente WebSocket)

### Paso 4: Instalar Dependencias del Cliente Vue

```bash
cd ../vue-chat
npm install
```

Resultado esperado:

```
added 312 packages, and audited 313 packages in 15s

98 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Dependencias instaladas:

- vue (Framework UI)
- typescript (Tipado estático)
- vite (Build tool)
- pinia (State management)
- socket.io-client (Cliente WebSocket)

## Ejecución del Sistema

El sistema requiere que las tres aplicaciones estén corriendo simultáneamente. Necesitarás abrir 3 terminales diferentes.

### Terminal 1: Servidor Socket.io

```bash
cd server
npm run dev
```

**Resultado esperado en consola:**

```
[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
Servidor Socket.io corriendo en http://localhost:3001
```

**Significado:**

- El servidor está escuchando en el puerto 3001
- Nodemon está monitoreando cambios en archivos
- Socket.io está listo para aceptar conexiones WebSocket

**Cuando un cliente se conecte verás:**

```
Usuario conectado: xyz123abc | Total conexiones: 1
```

**Cuando se envíe un mensaje verás:**

```
Mensaje recibido: {"id":"...","text":"Hola","username":"Usuario_123","timestamp":"2026-03-12T..."}
```

**Cuando un cliente se desconecte verás:**

```
Usuario desconectado: xyz123abc | Total conexiones: 0
```

### Terminal 2: Cliente React

```bash
cd react-chat
npm run dev
```

**Resultado esperado en consola:**

```
VITE v7.3.1  ready in 342 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Significado:**

- Vite inició el servidor de desarrollo
- La aplicación React está disponible en http://localhost:5173
- Hot Module Replacement (HMR) está activo
- Cualquier cambio en el código se reflejará instantáneamente

**En el navegador verás:**

- Interfaz de chat con fondo oscuro
- Nombre de usuario asignado automáticamente (ejemplo: "Usuario_7421")
- Indicador verde con texto "Conectado"
- Campo de entrada de texto activado
- Botón "Enviar" habilitado

**En la consola del navegador (F12) verás:**

```
Socket conectado
```

### Terminal 3: Cliente Vue

```bash
cd vue-chat
npm run dev
```

**Resultado esperado en consola:**

```
VITE v7.3.1  ready in 289 ms

➜  Local:   http://localhost:5176/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Nota sobre el puerto:** Si el puerto 5173 está ocupado por React, Vite automáticamente asigna 5174, 5175, o 5176.

**Significado:**

- Vite inició el servidor de desarrollo para Vue
- La aplicación Vue está disponible en el puerto mostrado
- HMR activo para desarrollo iterativo

**En el navegador verás:**

- Interfaz similar a React pero renderizada con Vue
- Nombre de usuario diferente asignado automáticamente
- Indicador verde con texto "Conectado"
- Campo de entrada listo para escribir

**En la consola del navegador (F12) verás:**

```
Socket conectado
```

## Verificación de Funcionamiento

### Prueba 1: Enviar Mensaje desde React

1. Abre http://localhost:5173 en una pestaña
2. Escribe "Hola desde React" en el campo de texto
3. Presiona Enter o haz clic en "Enviar"

**Resultado esperado:**

**En la interfaz React:**

- El mensaje aparece inmediatamente en la lista
- El campo de texto se limpia automáticamente
- La lista hace scroll hasta el último mensaje

**En la interfaz Vue (http://localhost:5176):**

- El mismo mensaje aparece instantáneamente
- Muestra el nombre de usuario de quien lo envió
- Incluye el timestamp del mensaje

**En la consola del servidor:**

```
Mensaje recibido: {"id":"abc123...","text":"Hola desde React","username":"Usuario_7421","timestamp":"2026-03-12T14:23:45.678Z"}
```

### Prueba 2: Enviar Mensaje desde Vue

1. Abre http://localhost:5176 en otra pestaña
2. Escribe "Hola desde Vue" en el campo de texto
3. Presiona Enter o haz clic en "Enviar"

**Resultado esperado:**

**En ambas interfaces:**

- El mensaje aparece en React y en Vue simultáneamente
- Cada aplicación muestra su propio nombre de usuario para sus mensajes
- Los mensajes se guardan en localStorage de cada aplicación

**En la consola del servidor:**

```
Mensaje recibido: {"id":"def456...","text":"Hola desde Vue","username":"Usuario_9832","timestamp":"2026-03-12T14:24:10.123Z"}
```

### Prueba 3: Persistencia en localStorage

1. Envía varios mensajes desde ambas aplicaciones
2. Cierra la pestaña del navegador
3. Vuelve a abrir la misma URL

**Resultado esperado:**

- Todos los mensajes anteriores siguen ahí
- La aplicación carga los mensajes automáticamente al iniciar
- Cada aplicación mantiene su propio historial

Para verificar en la consola del navegador (F12 → Application/Almacenamiento → Local Storage):

```javascript
// En React verás la clave:
chat-messages-react: "[{...},{...}]"

// En Vue verás la clave:
chat-messages-vue: "[{...},{...}]"
```

### Prueba 4: Reconexión Automática

1. Detén el servidor (Ctrl+C en la terminal del servidor)
2. Observa las interfaces de React y Vue

**Resultado esperado:**

- El indicador cambia a rojo con texto "Desconectado"
- El campo de entrada se deshabilita
- El botón "Enviar" se deshabilita

**En la consola del navegador verás:**

```
Socket desconectado
```

3. Reinicia el servidor con `npm run dev`

**Resultado esperado:**

- En 1-2 segundos, el indicador vuelve a verde "Conectado"
- Los campos se habilitan automáticamente
- Puedes enviar mensajes nuevamente

**En la consola del navegador verás:**

```
Socket conectado
```

### Prueba 5: Múltiples Usuarios (Simulación)

El servidor incluye un script de prueba automatizada:

```bash
cd server
node test-multiples-usuarios.js
```

**Resultado esperado en consola:**

```
=== Iniciando test de múltiples usuarios ===

Juan conectado al servidor
María conectada al servidor
Carlos conectado al servidor

Juan dice: Hola a todos
María dice: Hola Juan
Carlos dice: Hola equipo
Juan dice: Como estan?
María dice: Muy bien, gracias

=== Test completado ===
```

**Significado:**

- Se crean 3 conexiones Socket.io simultáneas
- Cada usuario envía mensajes automáticamente
- Se simula una conversación real
- Verifica que el broadcasting funciona correctamente

**En las interfaces de navegador:**

- Los mensajes de Juan, María y Carlos aparecen en tiempo real
- Cada mensaje tiene su timestamp y username
- La lista se actualiza automáticamente

## Solución de Problemas

### Error: Puerto 3001 en uso

**Síntoma:**

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solución:**

```bash
# En macOS/Linux
lsof -ti:3001 | xargs kill -9

# En Windows
netstat -ano | findstr :3001
taskkill /PID <número_pid> /F
```

### Error: Puerto 5173 en uso

Vite automáticamente asigna un puerto alternativo (5174, 5175, etc.). Usa el puerto que aparezca en la consola.

### Los mensajes no aparecen en la otra aplicación

Verifica que:

1. El servidor esté corriendo en puerto 3001
2. Ambos clientes estén conectados (indicador verde)
3. La URL del servidor en los servicios sea `http://localhost:3001`
4. No haya errores en la consola del navegador (F12)

### Error de CORS

Si ves errores de CORS en la consola:

```
Access to XMLHttpRequest has been blocked by CORS policy
```

Verifica que el servidor tenga CORS configurado correctamente en `server/index.js`:

```javascript
app.use(cors());
```

## Flujo de Datos

### Envío de Mensaje

1. Usuario escribe en el input y presiona Enter
2. El componente `MessageInput` captura el evento
3. Se llama al método `sendMessage()` del store (Zustand/Pinia)
4. El store crea un objeto mensaje con id, text, username y timestamp
5. Se emite el evento via `socketService.emit('message', mensaje)`
6. El mensaje se agrega al array local de mensajes
7. Se guarda en localStorage
8. El servidor recibe el mensaje y hace `io.emit()` a todos los clientes
9. Todos los clientes conectados reciben el mensaje (incluyendo el emisor)
10. Cada cliente actualiza su store y renderiza el nuevo mensaje

### Reconexión Automática

Socket.io maneja automáticamente las reconexiones:

- Si se pierde la conexión, intenta reconectar 5 veces
- Delay de 1 segundo entre intentos
- El store escucha los eventos `connect` y `disconnect`
- La UI se actualiza reactivamente mostrando el estado

## Estructura de Mensajes

Cada mensaje tiene la siguiente estructura TypeScript:

```typescript
interface Message {
  id: string; // UUID generado con crypto.randomUUID()
  text: string; // Contenido del mensaje
  username: string; // Usuario que envió el mensaje
  timestamp: string; // ISO string de la fecha/hora
}
```

Ejemplo:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "text": "Hola desde React",
  "username": "Usuario_7421",
  "timestamp": "2026-03-12T14:23:45.678Z"
}
```

## Gestión de Memoria y Cleanup

Ambas aplicaciones implementan limpieza adecuada de recursos:

**React:**

```typescript
useEffect(() => {
  const socketService = SocketService.getInstance();
  socketService.connect();

  return () => {
    socketService.disconnect();
  };
}, []);
```

**Vue:**

```typescript
onMounted(() => {
  const socketService = SocketService.getInstance();
  socketService.connect();
});

onUnmounted(() => {
  const socketService = SocketService.getInstance();
  socketService.disconnect();
});
```

## Decisiones de Diseño

### ¿Por qué Zustand para React?

- Tamaño minimalista: 1KB gzipped
- API simple sin boilerplate
- Hooks nativos de React
- No requiere Context Providers
- TypeScript first-class support

### ¿Por qué Pinia para Vue?

- Store oficial de Vue 3
- Integración completa con DevTools
- Composition API nativa
- Modular y extensible
- TypeScript support completo

### ¿Por qué Singleton en el Socket Service?

- Previene múltiples conexiones WebSocket
- Reduce uso de memoria y ancho de banda
- Evita duplicación de mensajes
- Facilita el debugging
- Patrón estándar para recursos compartidos

### ¿Por qué localStorage separado?

- Permite historiales independientes por aplicación
- Evita conflictos de datos
- Facilita debugging
- Permite limpiar historial individualmente

### ¿Por qué TypeScript en todo el proyecto?

- Prevención de errores en tiempo de desarrollo
- Autocompletado y mejor DX
- Refactoring seguro
- Documentación implícita en los tipos
- Integración con IDEs modernos

## Características de Código Limpio

- Nombres descriptivos de variables y funciones
- Funciones pequeñas con responsabilidad única
- Separación clara de capas
- Comentarios donde es necesario
- Consistencia en estilo de código
- Manejo explícito de errores
- Cleanup de recursos (listeners, conexiones)
- Inmutabilidad en operaciones de estado
- No uso de emojis en logs de producción

## Git Workflow

```
main
├── feature/socket-server
├── feature/socket-service
├── feature/react-chat
├── feature/vue-chat
├── fix/server-cleanup
└── fix/improve-readme
```

Todas las ramas se mantienen para referencia histórica.

## Comandos Útiles

### Desarrollo

```bash
# Servidor con auto-reload
cd server && npm run dev

# React con HMR
cd react-chat && npm run dev

# Vue con HMR
cd vue-chat && npm run dev
```

### Builds de Producción

```bash
# React production build
cd react-chat && npm run build

# Vue production build
cd vue-chat && npm run build

# Preview de builds
cd react-chat && npm run preview
cd vue-chat && npm run preview
```

### Linting

```bash
# React
cd react-chat && npm run lint

# Vue
cd vue-chat && npm run lint
```

## Autor

Yamil Aguirre - [GitHub](https://github.com/yamilaguirre)

## Repositorio

[https://github.com/yamilaguirre/finmarkets-chat-challenge](https://github.com/yamilaguirre/finmarkets-chat-challenge)

---

Marzo 2026
