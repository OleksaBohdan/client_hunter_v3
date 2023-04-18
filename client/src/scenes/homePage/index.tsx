import Navbar from '../navbar';
import { Box } from '@mui/material';

const HomePage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box sx={{ width: '100%', padding: '2rem 6%', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>HOME PAGE</Box>
      </Box>
    </Box>
  );
};

export default HomePage;
