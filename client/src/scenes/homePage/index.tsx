// import Navbar from '../navbar';
import ResponsiveNavbar from '../navbar/NavigationBar';
import { Box } from '@mui/material';

const HomePage = () => {
  return (
    <Box>
      {/* <Navbar /> */}
      <ResponsiveNavbar />
      {/* <Box sx={{ width: '100%', padding: '2rem 6%', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>HOME PAGE</Box>
      </Box> */}
    </Box>
  );
};

export default HomePage;
