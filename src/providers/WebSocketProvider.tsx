import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useReducer,
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

const RECONNECT_INTERVAL = 3000;

type State = {
  socket: WebSocket | null;
  isConnected: boolean;
};

type Action =
  | { type: "CONNECT"; socket: WebSocket }
  | { type: "DISCONNECT" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CONNECT":
      return { socket: action.socket, isConnected: true };
    case "DISCONNECT":
      return { socket: null, isConnected: false };
    default:
      return state;
  }
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatchAction] = useReducer(reducer, { socket: null, isConnected: false });
  const wsUrl = useMemo(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    return apiUrl.replace(/^http/, "ws").replace("/api", "") + "/ws";
  }, []);
  const { status, uid, roleId } = useSelector((state: any) => state.auth);
  const dispatchRedux = useDispatch();

  // Keep refs to avoid stale closures in message listeners without triggering reconnects
  const uidRef = React.useRef(uid);
  const roleIdRef = React.useRef(roleId);
  useEffect(() => {
    uidRef.current = uid;
    roleIdRef.current = roleId;
  }, [uid, roleId]);

  useEffect(() => {
    if (status !== "authenticated") {
      if (state.socket) {
        state.socket.close();
        dispatchAction({ type: "DISCONNECT" });
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
            const currentUid = uidRef.current;
            const currentRoleId = roleIdRef.current;

            if (data.type === "permissions-updated") {
              const targetId = data.payload?.id;
              const targetRoleId = data.payload?.roleId;

              if (currentUid == targetId || currentRoleId == targetRoleId) {
                dispatchRedux(fetchCurrentUser() as any);
                if (currentUid) {
                  dispatchRedux(fetchModulos(currentUid) as any);
                }
              }
            } else if (data.type === "notification") {
              if (data.payload.usuarioId && data.payload.usuarioId != currentUid) {
                 return;
              }
              window.dispatchEvent(
                new CustomEvent("notification-received", {
                  detail: data.payload,
                })
              );
            } else if (data.type === "notification-deleted") {
               if (data.payload.usuarioId && data.payload.usuarioId != currentUid) {
                  return;
               }
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
          dispatchAction({ type: "CONNECT", socket: ws });
        },
        () => {
          dispatchAction({ type: "DISCONNECT" });
          reconnectTimeout = setTimeout(connect, RECONNECT_INTERVAL);
        },
        (error) => {
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

  const contextValue = useMemo(() => ({ socket: state.socket }), [state.socket]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
