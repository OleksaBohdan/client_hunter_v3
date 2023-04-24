import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
  ButtonGroup,
  LinearProgress,
  Card,
  CardActions,
  CardContent,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';

import { IMainState } from '../../state';

export const ParsingResults = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: IMainState) => state.token);
  const user = useSelector((state: IMainState) => state.user);
  const cities = useSelector((state: IMainState) => state.cities);
  const { palette } = useTheme();
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, mt: 2 }}>
      <Box sx={{ minHeight: '1rem' }}>{isLoading && <LinearProgress />}</Box>
      <Typography variant="h5">Parsing results</Typography>
      {errorAlert && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}

      <StatusCards />
    </Box>
  );
};

const EqualHeightCard = styled(Card)(({ theme }) => ({
  m: 1,
  // minWidth: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
}));

function StatusCards() {
  const cardsData = [
    ['New', 200, 20],
    ['Updated', 100, 10],
    ['Deleted', 50, 5],
    ['Archived', 80, 8],
    ['Archived', 80, 8],
    ['Archived', 80, 8],
    ['Archived', 80, 8],
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {cardsData.map(([title, value, percentage], index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <EqualHeightCard>
              <CardContent sx={{ display: 'flex' }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="h4" color="text.primary">
                  {value} | {percentage}%
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Download</Button>
              </CardActions>
            </EqualHeightCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default StatusCards;
