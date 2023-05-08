import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, Alert, useTheme, ButtonGroup, LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IMainState, setBlackIndustrues } from '../../state';
import { BlackIndustry } from '../../types/BlackIndustry';

import { serverUrl } from '../../api/clientApi';

export const AddBlackIndustry = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: IMainState) => state.token);
  const blackIndustries = useSelector((state: IMainState) => state.blackIndustries);
  const { palette } = useTheme();
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    uploadBlackindustries();
  }, []);

  const uploadBlackindustries = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${serverUrl}/api/v1/blackindustries`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const { blackIndustries } = await response.json();
      dispatch(setBlackIndustrues({ blackIndustries }));
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBlackindustry = async (blackIndustry: string) => {
    if (blackIndustry === '') {
      return;
    }

    if (blackIndustry.length > 50) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${serverUrl}/api/v1/blackindustry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ blackIndustry: blackIndustry }),
      });

      if (response.status === 201) {
        const { newBlackIndustry } = await response.json();
        dispatch(setBlackIndustrues({ blackIndustries: [...blackIndustries, newBlackIndustry] }));
      }
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlackindustry = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${serverUrl}/api/v1/blackindustry/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 204) {
        const updatedBlackIndustrues = blackIndustries.filter((blackIndustry) => blackIndustry._id !== id);
        dispatch(setBlackIndustrues({ blackIndustries: updatedBlackIndustrues }));
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const BlackIndustryBtns = blackIndustries?.map((value: BlackIndustry) => {
    return (
      <ButtonGroup
        key={value._id}
        variant={'contained'}
        aria-label="split button"
        sx={{ marginRight: 2, marginTop: 2 }}
      >
        <Button>{value.name}</Button>
        <Button
          aria-label="delete"
          onClick={() => {
            handleDeleteBlackindustry(value._id);
          }}
          sx={{
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#d32f2f' },
          }}
        >
          <DeleteIcon sx={{ color: '#bdbdbd' }} />
        </Button>
      </ButtonGroup>
    );
  });

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, mt: 2 }}>
      <Box sx={{ minHeight: '1rem' }}>{isLoading && <LinearProgress />}</Box>
      <Typography variant="h5">Add blocked industry</Typography>
      <Typography>Warning: New founded companies with blocked industry will be added to black list</Typography>
      {errorAlert && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          const blackIndustryInput = (event.target as HTMLFormElement).elements.namedItem(
            'blackIndustryInput'
          ) as HTMLInputElement;
          handleAddBlackindustry(blackIndustryInput.value);
          const form = event.target as HTMLFormElement;
          form.reset();
        }}
        sx={{
          '& > :not(style)': { m: 1, width: '100$' },
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-basic"
          name="blackIndustryInput"
          label="Example: Real estate"
          variant="standard"
          sx={{ width: '85%' }}
        />
        <Button
          type="submit"
          sx={{
            width: '15%',
            ml: 1,
            p: 1,
            backgroundColor: palette.primary.main,
            color: palette.background.paper,
            '&:hover': { backgroundColor: palette.primary.main },
            fontWeight: '900',
          }}
        >
          Add
        </Button>
      </Box>
      <Box>{BlackIndustryBtns}</Box>
    </Box>
  );
};
