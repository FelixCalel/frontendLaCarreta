import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
// @ts-ignore
import { fetchModulos } from "../store/RolPermisoUsuario/thunks";
// @ts-ignore
import { fetchCurrentUser, startLogout } from "../store/auth/thunks";

interface IWebSocketContext {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<IWebSocketContext>({ socket: null });

export const useWebSocket = () => useContext(WebSocketContext);

const createWebSocket = (
  url: string,
  onMessage: (event: MessageEvent) => void,
  onOpen: () => void,
  onClose: () => void,
  onError: (event: Event) => void
): WebSocket => {
  const ws = new WebSocket(url);
  ws.onopen = () => {
    console.log("Conectado al servidor WebSocket en " + url);
    onOpen();
  };
  ws.onmessage = onMessage;
  ws.onerror = onError;
  ws.onclose = () => {
    onClose();
  };
  return ws;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const wsUrl = useMemo(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return apiUrl.replace(/^http/, "ws").replace("/api", "") + "/ws";
  }, []);
  const { status, uid } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status !== "authenticated") {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = createWebSocket(
        wsUrl,
        (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "permissions-updated") {
              const targetId = data.payload?.id;
              console.log("WS Event Received:", {
                type: data.type,
                targetId,
                currentUid: uid,
                match: uid == targetId,
              });

              if (uid == targetId) {
                console.log(
                  "Permisos actualizados. Cerrando sesión por seguridad..."
                );
                dispatch(startLogout() as any).then(() => {
                  window.location.reload();
                });
              }
            } else if (data.type === "notification") {
              window.dispatchEvent(
                new CustomEvent("notification-received", {
                  detail: data.payload,
                })
              );
            } else if (data.type === "notification-deleted") {
              window.dispatchEvent(
                new CustomEvent("notification-deleted", {
                  detail: data.payload,
                })
              );
            }
          } catch (e) {
            console.error("Error parsing WS message:", e);
          }
        },
        () => {
          setSocket(ws);
        },
        () => {
          setSocket(null);
          reconnectTimeout = setTimeout(connect, 3000);
        },
        (error) => {
          // Suppress connection errors to keep console clean
          console.warn("Advertencia en WebSocket:", error);
        }
      );
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [wsUrl, status]);

  const contextValue = useMemo(() => ({ socket }), [socket]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
