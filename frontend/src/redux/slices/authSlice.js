import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logout as logoutApi } from "@/services/shared/authService";
import { setAccessToken, clearAccessToken } from "@/services/shared/authToken";

// Async thunk: login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginApi(credentials);
      const { user, access_token } = res.data;
      setAccessToken(access_token); // lưu vào RAM
      return user;
    } catch (err) {
      const data = err?.response?.data;

      return rejectWithValue({
        message: data?.message || err.message || "Đã xảy ra lỗi đăng nhập.",
        code: data?.code || "UNKNOWN",
      });
    }
  }
);

// Async thunk: logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearAccessToken(); // xoá khỏi RAM
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ restoreSession gọi refresh trước
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const resRefresh = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:8000/api"
        }/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!resRefresh.ok) {
        throw new Error("Không thể refresh token");
      }

      const refreshData = await resRefresh.json();
      const accessToken = refreshData?.access_token;
      const user = refreshData?.user;

      if (!accessToken || !user) {
        throw new Error("Thiếu access token hoặc user");
      }

      setAccessToken(accessToken);
      return user;
    } catch (err) {
      clearAccessToken();
      return rejectWithValue(
        err?.response?.data || err?.message || "Session expired"
      );
    }
  }
);

// ✅ NEW: authSlice with sessionChecked
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    sessionChecked: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    resetAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // ✅ restoreSession
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sessionChecked = false; // đang kiểm tra
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.sessionChecked = true; // ✅ Đã kiểm tra xong
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.sessionChecked = true; // ✅ Dù lỗi vẫn đánh dấu đã kiểm tra
      });
  },
});

export const { setUser, resetAuthError } = authSlice.actions;
export default authSlice.reducer;
