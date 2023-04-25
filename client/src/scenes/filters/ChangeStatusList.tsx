import { useState } from 'react';
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

import { IMainState } from '../../state';

export const ChangeStatusList = () => {
  const token = useSelector((state: IMainState) => state.token);
  const [companyNames, setCompanyNames] = useState('');
  const [status, setStatus] = useState('white');
  const { palette } = useTheme();
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (companyNames.length === 0) {
      return;
    }

    const companies = companyNames.trim().split('\n');

    setIsLoading(true);
    try {
      await handleSubmitForm(companies, status);

      setCompanyNames('');
      setStatus('white');
    } catch (error) {
      setErrorAlert(true);
    }
    setIsLoading(false);
  };

  const handleSubmitForm = async (companies: string[], status: string) => {
    setErrorAlert(false);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/status`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, companies }),
      });

      if (response.status === 200) {
      } else {
        setErrorAlert(true);
      }
    } catch (err) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit}>
        <TextField
          id="company-names"
          label="Company names"
          multiline
          rows={4}
          variant="standard"
          sx={{ width: '100%' }}
          value={companyNames}
          onChange={(event) => setCompanyNames(event.target.value)}
        />

        <FormControl sx={{ mt: 2 }}>
          <FormLabel id="status-label">Status</FormLabel>
          <RadioGroup
            row
            aria-labelledby="status-label"
            name="row-radio-buttons-group"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map(({ value, label }) => (
              <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
            ))}
          </RadioGroup>

          <Button
            type="submit"
            sx={{
              width: '15%',
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
      </form>
    </Box>
  );
};

const statuses = [
  { value: 'white', label: 'White' },
  { value: 'grey', label: 'Grey' },
  { value: 'black', label: 'Black' },
  { value: 'request', label: 'Request' },
  { value: 'process', label: 'Process' },
  { value: 'reject', label: 'Reject' },
  { value: 'success', label: 'Success' },
];
