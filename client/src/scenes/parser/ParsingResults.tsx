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

  const CustomCard = styled(Card)(({ theme }) => ({
    width: '100%',
    margin: theme.spacing(1),
    borderRadius: 8,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }));

  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  const CustomCardContent = styled(CardContent)(({ theme }) => ({
    paddingBottom: theme.spacing(2),
  }));

  const TitleTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontFamily: '"Roboto Slab", serif',
    letterSpacing: '0.5px',
  }));

  const ValueTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontFamily: '"Roboto", sans-serif',
    letterSpacing: '0.25px',
  }));

  const StatusCards = () => {
    return (
      <Box sx={{ mt: 2 }}>
        {[
          ['New companies', 'white', 200, 20],
          ['Companies without email', 'grey', 100, 10],
          ['Companies in blacklist', 'black', 50, 5],
          ['Applied for cooperation', 'request', 80, 8],
          ['Response received from application', 'progress', 300, 30],
          ['Application denied', 'denied', 250, 25],
          ['New client', 'success', 20, 2],
        ].map(([title, status, value, percentage]) => (
          <CustomCard key={title}>
            <CustomCardContent>
              <TitleTypography variant="h5" color="text.secondary" gutterBottom>
                {title} | status: {status}
              </TitleTypography>
              <ValueTypography variant="h4" color="text.primary">
                {value} | {percentage}%
              </ValueTypography>
            </CustomCardContent>
            <CardActions>
              <CustomButton size="small">Download</CustomButton>
            </CardActions>
          </CustomCard>
        ))}
      </Box>
    );
  };

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

{
  /* <Box sx={{ mt: 2 }}>
<Card sx={{ width: '100%', m: 1 }}>
  <CardContent>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      New companies | status: white
    </Typography>
    <Typography variant="h4" color="text.primary">
      200 | 20%
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Download</Button>
  </CardActions>
</Card>
<Card sx={{ width: '100%', m: 1 }}>
  <CardContent>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      Companies without email | status: grey
    </Typography>
    <Typography variant="h4" color="text.primary">
      100 | 10%
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Download</Button>
  </CardActions>
</Card>
<Card sx={{ width: '100%', m: 1 }}>
  <CardContent>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      Companies in blacklist | status: black
    </Typography>
    <Typography variant="h4" color="text.primary">
      50 | 5%
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Download</Button>
  </CardActions>
</Card>
<Card sx={{ width: '100%', m: 1 }}>
  <CardContent>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      Aplied for cooperation | status: request
    </Typography>
    <Typography variant="h4" color="text.primary">
      80 | 8%
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Download</Button>
  </CardActions>
</Card>
<Card sx={{ width: '100%', m: 1 }}>
  <CardContent>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      Response received from application | status: progress
    </Typography>
    <Typography variant="h4" color="text.primary">
      300 | 30%
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Download</Button>
  </CardActions>
</Card>
<Card sx={{ width: '100%', m: 1 }}>
  <CardContent>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      Application denied | status: dinied
    </Typography>
    <Typography variant="h4" color="text.primary">
      250 | 25%
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Download</Button>
  </CardActions>
</Card>
<Card sx={{ width: '100%', m: 1 }}>
  <CardContent>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      New client | status: success
    </Typography>
    <Typography variant="h4" color="text.primary">
      20 | 2%
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Download</Button>
  </CardActions>
</Card>
</Box> */
}
