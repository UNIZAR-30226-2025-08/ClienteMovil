// socket.ts
import io from "socket.io-client";

// PONER LA URL DEL SERVIDOR
const socket = io("http://10.1.169.95:5000");

// Ejemplo de manejo de conexión y reconexión
socket.on("connect", () => {
  console.log("Conectado al servidor");
});

export default socket;
