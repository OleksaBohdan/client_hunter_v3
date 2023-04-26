import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMainState, setKeywords, setChoosenKeyword } from '../../state';
import { Box, Typography, TextField, Button, Alert, useTheme, ButtonGroup, LinearProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Keyword } from '../../types/Keyword';

export const ChooseKeyword = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: IMainState) => state.token);
  const user = useSelector((state: IMainState) => state.user);
  const keywords = useSelector((state: IMainState) => state.keywords);
  const { palette } = useTheme();
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    uploadKeywords();
  }, []);

  const uploadKeywords = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/v1/keywords', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const { keywords } = await response.json();
      dispatch(setKeywords({ keywords }));
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseKeyword = async (id: string) => {
    if (!user || id === user.keyword) {
      return;
    }
    setIsLoading(true);

    const prevKeyword = user.keyword;

    dispatch(setChoosenKeyword({ keyword: id }));

    try {
      const response = await fetch('http://localhost:3001/api/v1/keyword', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: id }),
      });

      if (response.status === 204) {
        setErrorAlert(false);
      } else {
        setErrorAlert(true);
        dispatch(setChoosenKeyword({ keyword: prevKeyword }));
      }
    } catch (error) {
      setErrorAlert(true);
      dispatch(setChoosenKeyword({ keyword: prevKeyword }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKeyword = async (keyword: string) => {
    if (keyword.trim() === '') {
      return;
    }

    if (keyword.length > 50) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/keyword', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword }),
      });

      if (response.status === 201) {
        const { newKeyword } = await response.json();
        dispatch(setKeywords({ keywords: [...keywords, newKeyword] }));
      }
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/v1/keyword/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 204) {
        const updatedKeywords = keywords.filter((keyword) => keyword._id !== id);
        dispatch(setKeywords({ keywords: updatedKeywords }));
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const keywordBtns = keywords?.map((value: Keyword) => {
    const isSelected = user && user.keyword === value._id;
    return (
      <ButtonGroup
        key={value._id}
        variant={isSelected ? 'contained' : 'outlined'}
        aria-label="split button"
        sx={{ marginRight: 2, marginTop: 2 }}
      >
        <Button onClick={() => handleChooseKeyword(value._id)}>{value.keyword}</Button>
        <Button
          aria-label="delete"
          onClick={() => {
            handleDeleteKeyword(value._id);
          }}
          sx={{
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#d32f2f' },
          }}
        >
          <DeleteIcon sx={{ color: 'grey' }} />
        </Button>
      </ButtonGroup>
    );
  });

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, mt: 2 }}>
      <Box sx={{ minHeight: '1rem' }}>{isLoading && <LinearProgress />}</Box>
      <Typography variant="h5">Choose Keyword to parse</Typography>

      {errorAlert && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          const keywordInput = (event.target as HTMLFormElement).elements.namedItem('keywordInput') as HTMLInputElement;
          handleAddKeyword(keywordInput.value);
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
          name="keywordInput"
          label="Example: Mechanic"
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
      <Box>{keywordBtns}</Box>
    </Box>
  );
};
