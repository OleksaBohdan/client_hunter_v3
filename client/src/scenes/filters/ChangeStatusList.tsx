import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Alert,
  useTheme,
  LinearProgress,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import { styled } from '@mui/system';

import { IMainState } from '../../state';

export const ChangeStatusList = () => {
  const token = useSelector((state: IMainState) => state.token);
  const { palette } = useTheme();
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, mt: 2 }}>
      <Box sx={{ minHeight: '1rem' }}>{isLoading && <LinearProgress />}</Box>
      <Typography variant="h5">Change status list</Typography>
      <Typography>NOTE: Paste each company name in new row</Typography>
      {errorAlert && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}

      <TextField
        id="standard-multiline-static"
        label="Company names"
        multiline
        rows={4}
        variant="standard"
        sx={{ width: '100%' }}
      />

      <FormControl sx={{ mt: 2 }}>
        <FormLabel id="status-radio-buttons-group-label">Status</FormLabel>
        <RadioGroup row aria-labelledby="status-radio-buttons-group-label" name="row-radio-buttons-group">
          <FormControlLabel value="white" control={<Radio />} label="white" />
          <FormControlLabel value="grey" control={<Radio />} label="grey" />
          <FormControlLabel value="black" control={<Radio />} label="black" />
          <FormControlLabel value="request" control={<Radio />} label="request" />
          <FormControlLabel value="process" control={<Radio />} label="process" />
          <FormControlLabel value="reject" control={<Radio />} label="reject" />
          <FormControlLabel value="success" control={<Radio />} label="success" />
        </RadioGroup>

        <Button
          type="submit"
          sx={{
            width: '15%',
            // ml: 1,
            mt: 2,

            backgroundColor: palette.primary.main,
            color: palette.background.paper,
            '&:hover': { backgroundColor: palette.primary.main },
            fontWeight: '900',
          }}
        >
          Save
        </Button>
      </FormControl>
    </Box>
  );
};
