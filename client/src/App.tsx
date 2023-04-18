import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/homePage';
import LoginPage from './scenes/loginPage';
import FiltersPage from './scenes/filtersPage';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { useSelector } from 'react-redux';

function App() {
  const theme = createTheme(themeSettings());
  const isAuth = Boolean(useSelector((state: any) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={isAuth ? <Navigate to="/home" /> : <LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/filters" element={isAuth ? <FiltersPage /> : <Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
