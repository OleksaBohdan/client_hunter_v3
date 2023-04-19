import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';
import { Parsers } from '../types/Parsers';

export interface IAuthState {
  user: User | null;
  token: string | null;
  keywords: any | null;
  cities: any | null;
  blackIndustries: any | null;
  emails: any | null;
  companies: any | null;
  parsers: Parsers[];
}

const initialState: IAuthState = {
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
  },
});

export const { setLogin, setLogout, setParsers } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// import { User } from '../types/User';

// const initialState = {
//   user: null,
//   token: null,
//   keywords: null,
//   cities: null,
//   blackIndustries: null,
//   emails: null,
//   companies: null,
//   parsers: null,
// };

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setLogin: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//     },
//     setLogout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//     setParsers: (state, action) => {
//       state.parsers = action.payload.parsers;
//     },
//   },
// });

// export const { setLogin, setLogout, setParsers } = authSlice.actions;
// export default authSlice.reducer;
