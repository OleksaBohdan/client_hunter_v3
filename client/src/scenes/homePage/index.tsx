import ResponsiveNavbar from '../navbar/NavigationBar';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <meta name="description" content="Welcome to Clienthunter!" />
        <title>Clienthunter-3 | home</title>
      </Helmet>

      <Box>
        <ResponsiveNavbar />
      </Box>
    </>
  );
};

export default HomePage;
