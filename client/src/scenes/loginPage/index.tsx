import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Form from './Form';
import logo from '../../assets/logo_full.png';

const LoginPage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width: 760)');
  return (
    <Box sx={{ height: '100vh' }}>
      <Box
        sx={{
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <img src={`${logo}?mw=164`} alt="logo" style={{ maxWidth: '250px' }} />
      </Box>

      <Box
        sx={{
          padding: '2rem',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }}>
          Create your account
        </Typography>

        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
