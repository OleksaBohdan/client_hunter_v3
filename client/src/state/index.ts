import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';
import { Parsers } from '../types/Parsers';
import { Keyword } from '../types/Keyword';

export interface IMainState {
  user: User | null;
  token: string | null;
  keywords: Keyword[] | null;
  cities: any | null;
  blackIndustries: any | null;
  emails: any | null;
  companies: any | null;
  parsers: Parsers[];
}

const initialState: IMainState = {
  user: null,
  token: null,
  keywords: null,
  cities: null,
  blackIndustries: null,
  emails: null,
  companies: null,
  parsers: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setParsers: (state, action: PayloadAction<{ parsers: Parsers[] }>) => {
      state.parsers = action.payload.parsers;
    },
    setChoosenParser: (state, action) => {
      if (state.user) {
        state.user.parser = action.payload.parser;
      }
    },
    setKeywords: (state, action: PayloadAction<{ keywords: Keyword[] }>) => {
      state.keywords = action.payload.keywords;
    },
    setChoosenKeyword: (state, action) => {
      if (state.user) {
        state.user.keyword = action.payload.keyword;
      }
    },
  },
});

export const { setLogin, setLogout, setParsers, setChoosenParser, setKeywords, setChoosenKeyword } = authSlice.actions;
export default authSlice.reducer;
