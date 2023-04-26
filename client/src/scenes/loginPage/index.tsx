import { Box } from '@mui/material';
import Form from './Form';
import logo from '../../assets/logo_full.png';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <meta name="description" content="Web site created using create-react-app" />
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
