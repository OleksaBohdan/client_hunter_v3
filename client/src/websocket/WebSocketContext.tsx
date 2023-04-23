import { createContext, useContext, useEffect, useState, useRef, PropsWithChildren } from 'react';

type WebSocketContextType = {
  socket: WebSocket | null;
};

const WebSocketContext = createContext<WebSocketContextType>({ socket: null });

export const useWebSocket = () => useContext(WebSocketContext);

type WebSocketProviderProps = PropsWithChildren<{}>;

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reconnect, setReconnect] = useState(false);
  const reconnectAttempts = useRef(0);

  const connect = () => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.addEventListener('open', (event) => {
      // console.log('WebSocket connected:', event);
      setSocket(ws);
      reconnectAttempts.current = 0;
    });

    ws.addEventListener('close', (event) => {
      // console.log('WebSocket disconnected:', event);
      setSocket(null);
      setReconnect(true);
    });

    ws.addEventListener('error', (event) => {
      // console.error('WebSocket error:', event);
      ws.close();
    });
  };

  useEffect(() => {
    connect();

    return () => {
      setReconnect(false);
      setSocket((currentSocket) => {
        if (currentSocket) {
          currentSocket.close();
        }
        return null;
      });
    };
  }, []);

  useEffect(() => {
    if (reconnect) {
      const timeoutId = setTimeout(() => {
        // console.log('Attempting to reconnect...');
        reconnectAttempts.current += 1;
        setReconnect(false);
        connect();
      }, Math.min(1000 * reconnectAttempts.current, 10000));

      return () => clearTimeout(timeoutId);
    }
  }, [reconnect]);

  return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>;
};
