import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';

type WebSocketContextType = {
  socket: WebSocket | null;
};

const WebSocketContext = createContext<WebSocketContextType>({ socket: null });

export const useWebSocket = () => useContext(WebSocketContext);

type WebSocketProviderProps = PropsWithChildren<{}>;

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    setSocket(ws);

    // return () => {
    //   ws.close();
    // };
  }, []);

  return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>;
};
