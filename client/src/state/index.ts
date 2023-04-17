import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  keywords: null,
  cities: null,
  blackIndustries: null,
  emails: null,
  companies: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});
