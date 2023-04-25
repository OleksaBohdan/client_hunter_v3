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
    </Box>
  );
};
