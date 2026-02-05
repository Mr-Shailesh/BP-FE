import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { User, AuthResponse } from "../../types/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: !!localStorage.getItem("token"),
  error: null,
};

// Async thunks
export const registerUser = createAsyncThunk<
  User,
  { firstName: string; lastName: string; email: string; password: string; passwordConfirm: string },
  { rejectValue: string }
>(
  "auth/register",
  async (
    { firstName, lastName, email, password, passwordConfirm },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.register(
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const checkAuthStatus = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      // Access user directly from response data
      return (response.data as any).user;
    } catch (err: any) {
      localStorage.removeItem("token");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const logoutUser = createAsyncThunk<
  null,
  void,
  { rejectValue: string }
>(
  "auth/logout",
  async () => {
    localStorage.removeItem("token");
    return null;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      // Check Auth
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
