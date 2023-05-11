import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMainState, setChoosenParser, setParsers } from '../../state';
import { Box, Typography, Button, Alert, LinearProgress } from '@mui/material';
import { Parsers } from '../../types/Parsers';

import { serverUrl } from '../../api/clientApi';

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
      const response = await fetch(`${serverUrl}/api/v1/parsers`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const { parsers } = await response.json();

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

    setIsLoading(true);

    const prevParser = user.parser;

    dispatch(setChoosenParser({ parser: id }));

    try {
      const response = await fetch(`${serverUrl}/api/v1/parser`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ parserId: id }),
      });

      if (response.status === 204) {
        setErrorAlert(false);
      } else {
        setErrorAlert(true);
        dispatch(setChoosenParser({ parser: prevParser }));
      }
    } catch (error) {
      setErrorAlert(true);
      dispatch(setChoosenParser({ parser: prevParser }));
    } finally {
      setIsLoading(false);
    }
  };

  const parsersBtns = parsers.map((value: Parsers) => {
    const isSelected = user && user.parser === value._id;
    const isLinkedin = value.name === 'linkedin.com';
  
    return (
      <Button
        key={value._id}
        variant={isSelected ? 'contained' : 'outlined'}
        sx={{ marginRight: 2, marginTop: 2 }}
        onClick={() => handleChooseParser(value._id)}
        disabled={isLinkedin} // Disable the button if it's linkedin
      >
        {value.name}
      </Button>
    );
  });
  
  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2 }}>
      <Box sx={{ minHeight: '1rem' }}>{isLoading && <LinearProgress />}</Box>
      <Typography variant="h5">Choose Website to parse</Typography>
      {errorAlert && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}
      <Box>{parsersBtns}</Box>
    </Box>
  );
};
