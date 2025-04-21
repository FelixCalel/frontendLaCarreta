import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface IWebSocketContext {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<IWebSocketContext>({ socket: null });

export const useWebSocket = () => useContext(WebSocketContext);

const createWebSocket = (url: string, onMessage: (event: MessageEvent) => void, onOpen: () => void, onClose: () => void, onError: (event: Event) => void): WebSocket => {
  const ws = new WebSocket(url);
  ws.onopen = () => {
    console.log("Conectado al servidor WebSocket");
    onOpen();
  };
  ws.onmessage = onMessage;
  ws.onerror = onError;
  ws.onclose = () => {
    onClose();
  };
  return ws;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000';

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = createWebSocket(
        wsUrl,
        (event) => {
          console.log("Mensaje recibido:", event.data);
        },
        () => {
          setSocket(ws);
        },
        () => {
          setSocket(null);
          reconnectTimeout = setTimeout(connect, 3000);
        },
        (error) => {
          //console.warn("Advertencia en WebSocket:", error);
        }
      );
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws.close();
    };
  }, [wsUrl]);

  const contextValue = useMemo(() => ({ socket }), [socket]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
