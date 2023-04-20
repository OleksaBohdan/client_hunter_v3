import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMainState, setKeywords, setChoosenKeyword } from '../../state';

import { Box, Typography, TextField, Button, Alert, CircularProgress, useTheme, ButtonGroup } from '@mui/material';
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
      const parserResponse = await fetch('http://localhost:3001/api/v1/keywords', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const { keywords } = await parserResponse.json();

      dispatch(setKeywords({ keywords }));
      setErrorAlert(false);
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

    const prevKeyword = user.keyword;

    dispatch(setChoosenKeyword({ keyword: id }));

    try {
      const parserResponse = await fetch('http://localhost:3001/api/v1/keyword', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: id }),
      });

      if (parserResponse.status === 204) {
        setErrorAlert(false);
      } else {
        setErrorAlert(true);
        dispatch(setChoosenKeyword({ keyword: prevKeyword }));
      }
    } catch (error) {
      setErrorAlert(true);
      dispatch(setChoosenKeyword({ keyword: prevKeyword }));
    }
  };

  const handleAddKeyword = async (keyword: string) => {
    try {
      const parserResponse = await fetch('http://localhost:3001/api/v1/keyword', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword }),
      });

      const { newKeyword } = await parserResponse.json();
      console.log(newKeyword);
      console.log(keywords);
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
          // onClick={onDelete}
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
      <Typography variant="h5">Choose Keyword to parse</Typography>
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
          label="Example: mechanic"
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
