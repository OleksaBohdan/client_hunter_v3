import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IAuthState } from '../../state';

import { Box, Typography, Button, Alert } from '@mui/material';
import { setParsers } from '../../state';
import { Parsers } from '../../types/Parsers';

export const ChooseWebsite = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: IAuthState) => state.token);
  const parsers = useSelector((state: IAuthState) => state.parsers);

  useEffect(() => {
    uploadParsers();
  }, []);

  const uploadParsers = async () => {
    const parserResponse = await fetch('http://localhost:3001/api/v1/parsers', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const { parsers } = await parserResponse.json();

    dispatch(setParsers({ parsers: parsers }));
  };

  const handleChooseParser = async (id: string) => {
    const parserResponse = await fetch('http://localhost:3001/api/v1/parser', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ parserId: id }),
    });

    if (parserResponse.status === 204) {
      console.log('Parsed choosen succesfully');
    }
  };

  const parsersBtns = parsers.map((value: Parsers, index: number) => {
    return (
      <Button
        key={value._id}
        variant="contained"
        sx={{ marginRight: 2, marginTop: 2 }}
        onClick={() => {
          handleChooseParser(value._id);
        }}
      >
        {value.name}
      </Button>
    );
  });

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2 }}>
      <Typography variant="h5">Choose Website to parse</Typography>
      <Alert severity="success" sx={{ marginTop: 1 }}>
        This is a success alert — check it out!
      </Alert>
      {/* <Alert severity="error">This is an error alert — check it out!</Alert> */}
      <Box>{parsersBtns}</Box>
    </Box>
  );
};
