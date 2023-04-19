import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMainState, setChoosenParser, setParsers } from '../../state';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { Parsers } from '../../types/Parsers';

export const ChooseWebsite = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: IMainState) => state.token);
  const parsers = useSelector((state: IMainState) => state.parsers);
  const user = useSelector((state: IMainState) => state.user);
  const [errorAlert, setErrorAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    uploadParsers();
  }, []);

  const uploadParsers = async () => {
    setIsLoading(true);

    try {
      const parserResponse = await fetch('http://localhost:3001/api/v1/parsers', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const { parsers } = await parserResponse.json();

      dispatch(setParsers({ parsers }));
      setErrorAlert(false);
    } catch (error) {
      setErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseParser = async (id: string) => {
    if (!user || id === user.parser) {
      return;
    }

    const prevParser = user.parser;

    dispatch(setChoosenParser({ parser: id }));

    try {
      const parserResponse = await fetch('http://localhost:3001/api/v1/parser', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ parserId: id }),
      });

      if (parserResponse.status === 204) {
        setErrorAlert(false);
      } else {
        setErrorAlert(true);
        dispatch(setChoosenParser({ parser: prevParser }));
      }
    } catch (error) {
      setErrorAlert(true);
      dispatch(setChoosenParser({ parser: prevParser }));
    }
  };

  const parsersBtns = parsers.map((value: Parsers) => {
    const isSelected = user && user.parser === value._id;

    return (
      <Button
        key={value._id}
        variant={isSelected ? 'contained' : 'outlined'}
        sx={{ marginRight: 2, marginTop: 2 }}
        onClick={() => handleChooseParser(value._id)}
      >
        {value.name}
      </Button>
    );
  });

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2 }}>
      <Typography variant="h5">Choose Website to parse</Typography>

      {isLoading && <CircularProgress sx={{ marginTop: 1 }} />}

      {!isLoading && (
        <>
          {errorAlert && (
            <Alert severity="error" sx={{ marginTop: 1 }}>
              Failed to choose parser. Please try again.
            </Alert>
          )}
          <Box>{parsersBtns}</Box>
        </>
      )}
    </Box>
  );
};