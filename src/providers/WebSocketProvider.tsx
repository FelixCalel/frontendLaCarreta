import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useDispatch, useSelector } from "react-redux";
// @ts-expect-error Thunk en archivo JS sin tipos TypeScript exportados
import { fetchModulos } from "../store/RolPermisoUsuario/thunks";
// @ts-expect-error Thunk en archivo JS sin tipos TypeScript exportados
import { fetchCurrentUser } from "../store/auth/thunks";

interface IWebSocketContext {
  socket: WebSocket | null;
}

interface AuthState {
  status: string;
  uid: string | number | null;
  roleId: string | number | null;
}

interface RootState {
  auth: AuthState;
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

type Action = { type: "CONNECT"; socket: WebSocket } | { type: "DISCONNECT" };

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
  const [state, dispatchAction] = useReducer(reducer, {
    socket: null,
    isConnected: false,
  });
  const wsUrl = useMemo(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    return apiUrl.replace(/^http/, "ws").replace("/api", "") + "/ws";
  }, []);
  const { status, uid, roleId } = useSelector(
    (currentState: RootState) => currentState.auth
  );
  const dispatchRedux = useDispatch();

  const socketRef = React.useRef<WebSocket | null>(null);
  useEffect(() => {
    socketRef.current = state.socket;
  }, [state.socket]);

  const uidRef = React.useRef(uid);
  const roleIdRef = React.useRef(roleId);
  useEffect(() => {
    uidRef.current = uid;
    roleIdRef.current = roleId;
  }, [uid, roleId]);

  useEffect(() => {
    if (status !== "authenticated") {
      if (socketRef.current) {
        socketRef.current.close();
        dispatchAction({ type: "DISCONNECT" });
        socketRef.current = null;
      }
      return;
    }

    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isEffectActive = true;

    const connect = () => {
      if (!isEffectActive) return;

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
                dispatchRedux(fetchCurrentUser() as never);
                if (currentUid) {
                  dispatchRedux(fetchModulos(currentUid) as never);
                }
              }
            } else if (data.type === "notification") {
              if (
                data.payload.usuarioId &&
                data.payload.usuarioId != currentUid
              ) {
                return;
              }
              globalThis.dispatchEvent(
                new CustomEvent("notification-received", {
                  detail: data.payload,
                })
              );
            } else if (data.type === "notification-deleted") {
              if (
                data.payload.usuarioId &&
                data.payload.usuarioId != currentUid
              ) {
                return;
              }
              globalThis.dispatchEvent(
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
          if (!isEffectActive) {
            ws?.close();
            return;
          }
          dispatchAction({ type: "CONNECT", socket: ws });
        },
        () => {
          if (!isEffectActive) return;
          dispatchAction({ type: "DISCONNECT" });
          reconnectTimeout = setTimeout(connect, RECONNECT_INTERVAL);
        },
        (error) => {
          if (!isEffectActive) return;
          if (
            ws &&
            (ws.readyState === WebSocket.CLOSING ||
              ws.readyState === WebSocket.CLOSED)
          ) {
            return;
          }
          console.warn("Advertencia en WebSocket:", error);
        }
      );
    };

    connect();

    return () => {
      isEffectActive = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.onopen = () => ws.close();
          ws.onclose = null;
          ws.onerror = null;
          ws.onmessage = null;
        } else {
          ws.close();
        }
      }
    };
  }, [dispatchRedux, status, wsUrl]);

  const contextValue = useMemo(
    () => ({ socket: state.socket }),
    [state.socket]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
