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

import { serverUrl } from '../../api/clientApi';

export const ParsingResults = () => {
  const token = useSelector((state: IMainState) => state.token);
  const { palette } = useTheme();
  const [companiesCount, setCompaniesCount] = useState<CompanyCount>(defaultCompaniesCount);
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCompaniesCount();
  }, []); // eslint-disable-line

  const handleUpdateCompaniesCount = async () => {
    fetchCompaniesCount();
  };

  const fetchCompaniesCount = async () => {
    setErrorAlert(false);
    try {
      setIsLoading(true);
      const response = await fetch(`${serverUrl}/api/v1/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const companiesCount = data.companiesListCount;
      setCompaniesCount(companiesCount);
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (status: string) => {
    setErrorAlert(false);
    try {
      setIsLoading(true);
      const response = await fetch(`${serverUrl}/api/v1/companies/${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.blob();

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'companies.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
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

      <Button
        variant="contained"
        sx={{
          '&:hover': { backgroundColor: palette.primary.main },
          mt: 2,
        }}
        onClick={handleUpdateCompaniesCount}
      >
        update results
      </Button>

      <StatusCards companiesCount={companiesCount || {}} handleDownload={handleDownload} />
    </Box>
  );
};

interface StatusCardsProps {
  companiesCount: CompanyCount;
  handleDownload: (status: string) => void;
}

function StatusCards({ companiesCount, handleDownload }: StatusCardsProps) {
  const EqualHeightCard = styled(Card)(({ theme }) => ({
    m: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  }));

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {Object.entries(companiesCount).map(([key, value], index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <EqualHeightCard>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  {key.charAt(0).toUpperCase() + key.slice(1)} list
                </Typography>
                <Typography variant="h4" color="text.primary">
                  {value.count} | {value.percent}%
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleDownload(key)}>
                  Download
                </Button>
              </CardActions>
            </EqualHeightCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

interface CompanyCount {
  all: {
    count: number;
    percent: number;
  };
  white: {
    count: number;
    percent: number;
  };
  grey: {
    count: number;
    percent: number;
  };
  black: {
    count: number;
    percent: number;
  };
  request: {
    count: number;
    percent: number;
  };
  process: {
    count: number;
    percent: number;
  };
  reject: {
    count: number;
    percent: number;
  };
  success: {
    count: number;
    percent: number;
  };
}

const defaultCompaniesCount: CompanyCount = {
  all: { count: 0, percent: 0 },
  white: { count: 0, percent: 0 },
  grey: { count: 0, percent: 0 },
  black: { count: 0, percent: 0 },
  request: { count: 0, percent: 0 },
  process: { count: 0, percent: 0 },
  reject: { count: 0, percent: 0 },
  success: { count: 0, percent: 0 },
};
