import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { useSelector } from 'react-redux';
import { WebSocketProvider } from './websocket/WebSocketContext';

function App() {
  const theme = createTheme(themeSettings());
  const isAuth = Boolean(useSelector((state: any) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <WebSocketProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={isAuth ? <Navigate to="/home" /> : <LoginPage />} />
              <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            </Routes>
          </ThemeProvider>
        </WebSocketProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
