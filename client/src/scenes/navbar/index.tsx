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
  MenuList,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../state';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/User';
import FlexBetween from '../../components/FlexBetween';
import logo from '../../assets/logo_short.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: { user: User }) => state.user);

  const theme = useTheme();

  return (
    <FlexBetween
      sx={{ height: '100vh', width: 260, backgroundColor: 'white', flexDirection: 'column', padding: '2rem 0 2rem 0' }}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ textAlign: 'center' }}>
          <img src={`${logo}`} alt="logo" style={{ maxHeight: '4rem' }} />
        </Box>

        <MenuList>
          <MenuItem
            onClick={() => {
              navigate('/home');
            }}
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/filters');
            }}
          >
            Filters
          </MenuItem>
        </MenuList>
      </Box>

      <Box sx={{ width: '100%', borderTop: '1px solid #607d8b ' }}>
        <MenuList>
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={() => dispatch(setLogout())}>Logout</MenuItem>
        </MenuList>
      </Box>
    </FlexBetween>
  );
};

export default Navbar;
