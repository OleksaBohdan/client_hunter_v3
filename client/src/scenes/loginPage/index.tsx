import { Box, Typography } from '@mui/material';
import Form from './Form';
import logo from '../../assets/logo_full.png';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <meta name="description" content="Welcome to Clienthunter!" />
        <title>Clienthunter-3</title>
      </Helmet>
      <Box sx={{ height: '100vh' }}>
        <Box
          sx={{
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <img src={`${logo}?mw=164`} alt="logo" style={{ maxWidth: '250px' }} />

          <Typography
            sx={{
              fontSize: 24,
              mt: 6,
              fontWeight: 'bold',
              color: '#1c1e21',
              letterSpacing: 1,
              lineHeight: 1.5,
            }}
          >
            The easy tool to find new potential clients
          </Typography>
        </Box>

        <Box
          sx={{
            padding: '2rem',
            paddingTop: '4rem',
            textAlign: 'center',
            maxWidth: '700px',
            m: '2rem auto',
          }}
        >
          <Form />
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
