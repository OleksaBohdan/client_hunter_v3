import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../state';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/User';
import FlexBetween from '../../components/FlexBetween';

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state: { user: User }) => state.user);

  const theme = useTheme();
  const mainBlue = theme.palette.primary.main;
  const mainPaper = theme.palette.background.paper;

  return <FlexBetween sx={{ height: '100vh', width: 260 }}></FlexBetween>;
};

export default Navbar;
