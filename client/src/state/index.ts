import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';
import { Parsers } from '../types/Parsers';
import { Keyword } from '../types/Keyword';
import { City } from '../types/City';
import { BlackIndustry } from '../types/BlackIndustry';

export interface IMainState {
  user: User | null;
  token: string | null;
  keywords: Keyword[];
  cities: City[];
  blackIndustries: BlackIndustry[];
  emails: any | null;
  companies: any | null;
  parsers: Parsers[];
}

const initialState: IMainState = {
  user: null,
  token: null,
  keywords: [],
  cities: [],
  blackIndustries: [],
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
    setCities: (state, action: PayloadAction<{ cities: City[] }>) => {
      state.cities = action.payload.cities;
    },
    setChoosenCity: (state, action) => {
      if (state.user) {
        state.user.city = action.payload.city;
      }
    },
    setBlackIndustrues: (state, action: PayloadAction<{ blackIndustries: BlackIndustry[] }>) => {
      state.blackIndustries = action.payload.blackIndustries;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setParsers,
  setChoosenParser,
  setKeywords,
  setChoosenKeyword,
  setCities,
  setChoosenCity,
  setBlackIndustrues,
} = authSlice.actions;
export default authSlice.reducer;
