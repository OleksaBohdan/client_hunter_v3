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
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        const msgObj = JSON.parse(event.data);
        const { message, type } = msgObj;

        if (type === 'progress') {
          setProgress(message);
          return;
        }

        addNotification(message.replace('NaN', '0'), type);
      });
    }
  }, [socket]);

  const onStart = () => {
    if (socket) {
      setProgress(0);
      socket.send(JSON.stringify({ id: user?._id, command: 'START' }));
    }
  };

  const onStop = () => {
    if (socket) {
      setProgress(0);
      socket.send(JSON.stringify({ id: user?._id, command: 'STOP' }));
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
          onClick={onStart}
        >
          START
        </Button>

        <Button
          variant="contained"
          size="large"
          sx={{
            '&:hover': { backgroundColor: palette.primary.main },
          }}
          onClick={onStop}
        >
          STOP
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
      return '#42b72a';
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
