import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Alert, useTheme, LinearProgress, TextField, FormControl } from '@mui/material';
import { IMainState } from '../../state';

import { serverUrl } from '../../api/clientApi';

export const DeleteCompanies = () => {
  const token = useSelector((state: IMainState) => state.token);
  const [companyNames, setCompanyNames] = useState('');
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
      await handleSubmitForm(companies);

      setCompanyNames('');
    } catch (error) {
      setErrorAlert(true);
    }
    setIsLoading(false);
  };

  const handleSubmitForm = async (companies: string[]) => {
    setErrorAlert(false);
    try {
      const response = await fetch(`${serverUrl}/api/v1/companies`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies }),
      });

      if (response.status === 204) {
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
      <Typography variant="h5">Delete companies</Typography>
      <Typography>Note: Paste each company name on a new line</Typography>

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
          <Button
            type="submit"
            sx={{
              width: '120px',
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
