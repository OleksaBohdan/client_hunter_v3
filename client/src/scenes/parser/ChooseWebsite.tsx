import { Box, Typography, Button, Alert } from '@mui/material';

export const ChooseWebsite = () => {
  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2 }}>
      <Typography variant="h5">Choose Website to parse</Typography>
      <Alert severity="success" sx={{ marginTop: 1 }}>
        This is a success alert — check it out!
      </Alert>
      {/* <Alert severity="error">This is an error alert — check it out!</Alert> */}
      <Box>
        <Button variant="contained" sx={{ marginRight: 2, marginTop: 2 }}>
          Contained
        </Button>
        <Button variant="outlined" sx={{ marginRight: 2, marginTop: 2 }}>
          Outlined
        </Button>
        <Button variant="outlined" sx={{ marginRight: 2, marginTop: 2 }}>
          Outlined
        </Button>
        <Button variant="outlined" sx={{ marginRight: 2, marginTop: 2 }}>
          Outlined
        </Button>
      </Box>
    </Box>
  );
};
