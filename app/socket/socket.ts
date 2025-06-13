import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (
  token: string,
  deviceToken: string,
  
): Socket => {
  if (socket?.connected) {
    socket.disconnect();
  }

 socket = io("https://shareandcareshop.onrender.com", {
  auth: {
    token,
    deviceToken,
    role: "admin",
  }
  // autoConnect: true là mặc định rồi
});

  socket.connect();

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socket.on("new_message", (data) => {
    console.log("📩 Received new_message:", data);
  });

  socket.on("refresh_conversations", (data) => {
    console.log("📩 refresh_conversations received:", data);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
