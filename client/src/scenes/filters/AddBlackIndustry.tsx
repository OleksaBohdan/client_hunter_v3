import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Alert,
  useTheme,
  LinearProgress,
  Card,
  CardActions,
  CardContent,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';

import { IMainState } from '../../state';

export const AddBlackIndustry = () => {
  const token = useSelector((state: IMainState) => state.token);
  const { palette } = useTheme();

  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, mt: 2 }}>
      <Box sx={{ minHeight: '1rem' }}>{isLoading && <LinearProgress />}</Box>
      <Typography variant="h5">Add unwanted Industry</Typography>
      <Typography>NOTE: Companies with unwanted industry will be added to Black List</Typography>
      {errorAlert && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}
    </Box>
  );
};
