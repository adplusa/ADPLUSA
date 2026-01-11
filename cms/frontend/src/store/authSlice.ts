import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: (() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.warn('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  })(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log('🔄 setCredentials called with:', action.payload);

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      console.log('💾 Setting localStorage token:', action.payload.token);
      localStorage.setItem('token', action.payload.token);

      console.log('💾 Setting localStorage user:', JSON.stringify(action.payload.user));
      localStorage.setItem('user', JSON.stringify(action.payload.user));

      console.log('✅ localStorage updated successfully');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
