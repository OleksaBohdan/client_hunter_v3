import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Alert, useTheme } from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { IMainState } from '../../state';
import { useWebSocket } from '../../websocket/WebSocketContext';

export const StartParser = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: IMainState) => state.token);
  const user = useSelector((state: IMainState) => state.user);
  const { palette } = useTheme();
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { socket } = useWebSocket();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        console.log('Message from server:', event.data);
        addNotification(event.data, 'success');
      });
    }
  }, [socket]);

  const onStart = () => {
    if (socket) {
      socket.send(JSON.stringify({ id: user?._id, command: 'START' }));
    }
  };

  const addNotification = (message: string, type: 'success' | 'warning' | 'error' | 'regular') => {
    const newNotification: Notification = {
      message,
      type,
      timestamp: new Date().toLocaleString(),
    };
    setNotifications((prevState) => [...prevState, newNotification]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleStart = async () => {
    setIsLoading(true);
    setErrorAlert(false);
    try {
      const response = await fetch('http://localhost:3001/api/v1/start', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setIsLoading(false);
        addNotification('Start parser...', 'regular');
      } else if (response.status === 403) {
        setIsLoading(false);
        addNotification('Parser already running.', 'warning');
      } else {
        setErrorAlert(true);
      }
    } catch (err) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    setErrorAlert(false);
    try {
      const response = await fetch('http://localhost:3001/api/v1/stop', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setIsLoading(false);
        addNotification('Stop parser...', 'regular');
      } else {
        setErrorAlert(true);
      }
    } catch (err) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, mt: 2 }}>
      <Box sx={{ minHeight: '1rem' }}>{isLoading && <LinearProgress />}</Box>
      <Typography variant="h5">Parser</Typography>
      {errorAlert && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}

      <Box sx={{ width: '100%' }}>
        <LinearProgressWithLabel value={progress} />
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Notifications
      </Typography>

      <Box>
        <NotificationFeed notifications={notifications} addNotification={addNotification} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          size="large"
          sx={{ mr: 2, backgroundColor: palette.primary.light, '&:hover': { backgroundColor: palette.primary.light } }}
          onClick={handleStart}
        >
          START
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{
            '&:hover': { backgroundColor: palette.primary.main },
          }}
          onClick={handleStop}
        >
          STOP
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{ mr: 2, backgroundColor: palette.primary.light, '&:hover': { backgroundColor: palette.primary.light } }}
          onClick={onStart}
        >
          START
        </Button>
      </Box>
    </Box>
  );
};

// NITIFICATION FEED

const NotificationFeed = ({ notifications, addNotification }: NotificationFeedProps) => {
  const notificationBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notificationBoxRef.current) {
      notificationBoxRef.current.scrollTop = notificationBoxRef.current.scrollHeight;
    }
  }, [notifications]);

  return (
    <Box ref={notificationBoxRef} sx={{ backgroundColor: '#212121', color: 'white', height: 300, overflowY: 'auto' }}>
      {notifications.map((notification, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {`[${notification.timestamp}] `}
          <span style={{ color: typeToColor(notification.type) }}>{notification.message}</span>
        </Typography>
      ))}
    </Box>
  );
};

interface Notification {
  message: string;
  type: 'success' | 'warning' | 'error' | 'regular';
  timestamp: string;
}

interface NotificationFeedProps {
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'warning' | 'error' | 'regular') => void;
}

const typeToColor = (type: 'success' | 'warning' | 'error' | 'regular') => {
  switch (type) {
    case 'success':
      return 'green';
    case 'warning':
      return 'orange';
    case 'error':
      return 'red';
    case 'regular':
      return 'white';
    default:
      return 'white';
  }
};

// PROGRESS FEED

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} sx={{ height: 7 }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
