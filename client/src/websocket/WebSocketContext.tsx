import { createContext, useContext, useEffect, useState, useRef, PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMainState } from '../state';

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
  const user = useSelector((state: IMainState) => state.user);
  const token = useSelector((state: IMainState) => state.token);

  // const connect = () => {
  //   const ws = new WebSocket('ws://localhost:3001');

  //   ws.addEventListener('open', (event) => {
  //     setSocket(ws);
  //     reconnectAttempts.current = 0;
  //   });

  //   ws.addEventListener('close', (event) => {
  //     setSocket(null);
  //     setReconnect(true);
  //   });

  //   ws.addEventListener('error', (event) => {
  //     ws.close();
  //   });
  // };
  const connect = () => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.addEventListener('open', (event) => {
      // Get the user's ID from your session management code
      const userId = user?._id;

      // Send the user's ID to the server
      ws.send(JSON.stringify({ type: 'userId', data: userId }));

      setSocket(ws);
      reconnectAttempts.current = 0;
    });

    ws.addEventListener('close', (event) => {
      setSocket(null);
      setReconnect(true);
    });

    ws.addEventListener('error', (event) => {
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
  }, [token]);

  useEffect(() => {
    if (reconnect) {
      const timeoutId = setTimeout(() => {
        reconnectAttempts.current += 1;
        setReconnect(false);
        connect();
      }, Math.min(1000 * reconnectAttempts.current, 10000));

      return () => clearTimeout(timeoutId);
    }
  }, [reconnect]);

  return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>;
};
