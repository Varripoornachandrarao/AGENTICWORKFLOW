import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

export function useSocket() {
  const user = useAuthStore((state) => state.user);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const socket = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001", {
      autoConnect: false
    });
  }, []);

  useEffect(() => {
    if (!socket || !user?.id) {
      return undefined;
    }

    socket.connect();
    socket.emit("user:subscribe", user.id);
    socket.on("notification:new", addNotification);

    return () => {
      socket.off("notification:new", addNotification);
      socket.disconnect();
    };
  }, [socket, user?.id, addNotification]);

  return socket;
}
