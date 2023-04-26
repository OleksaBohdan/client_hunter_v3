import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMainState, setCities, setChoosenCity } from '../../state';
import { Box, Typography, TextField, Button, Alert, useTheme, ButtonGroup, LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { City } from '../../types/City';

export const ChooseCity = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: IMainState) => state.token);
  const user = useSelector((state: IMainState) => state.user);
  const cities = useSelector((state: IMainState) => state.cities);
  const { palette } = useTheme();
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    uploadCities();
  }, []);

  const uploadCities = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/v1/cities', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const { cities } = await response.json();
      dispatch(setCities({ cities }));
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseCity = async (id: string) => {
    if (!user || id === user.city) {
      return;
    }
    setIsLoading(true);

    const prevCity = user.city;

    dispatch(setChoosenCity({ city: id }));

    try {
      const response = await fetch('http://localhost:3001/api/v1/city', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityId: id }),
      });

      if (response.status === 204) {
        setErrorAlert(false);
      } else {
        setErrorAlert(true);
        dispatch(setChoosenCity({ city: prevCity }));
      }
    } catch (error) {
      setErrorAlert(true);
      dispatch(setChoosenCity({ city: prevCity }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCity = async (city: string) => {
    if (city.trim() === '') {
      return;
    }

    if (city.length > 50) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/city', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: city }),
      });

      if (response.status === 201) {
        const { newCity } = await response.json();
        dispatch(setCities({ cities: [...cities, newCity] }));
      }
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCity = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/city/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 204) {
        const updatedCities = cities.filter((city) => city._id !== id);
        dispatch(setCities({ cities: updatedCities }));
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const citiesBtns = cities?.map((value: City) => {
    const isSelected = user && user.city === value._id;
    return (
      <ButtonGroup
        key={value._id}
        variant={isSelected ? 'contained' : 'outlined'}
        aria-label="split button"
        sx={{ marginRight: 2, marginTop: 2 }}
      >
        <Button onClick={() => handleChooseCity(value._id)}>{value.city}</Button>
        <Button
          aria-label="delete"
          onClick={() => {
            handleDeleteCity(value._id);
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
      <Typography variant="h5">Choose City to parse</Typography>

      {errorAlert && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          const cityInput = (event.target as HTMLFormElement).elements.namedItem('cityInput') as HTMLInputElement;
          handleAddCity(cityInput.value);
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
          name="cityInput"
          label="Example: Berlin"
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
      <Box>{citiesBtns}</Box>
    </Box>
  );
};
