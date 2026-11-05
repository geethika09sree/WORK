import { createSlice } from "@reduxjs/toolkit";

const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode) – session just won't persist */
  }
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

// Read the `exp` claim so we never boot into a session with an already-expired token.
// (The server is still the real authority – this just avoids a pointless 401 round trip.)
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function loadInitialState() {
  const token = safeGet("token");
  let user = null;

  try {
    user = JSON.parse(safeGet("user"));
  } catch {
    user = null;
  }

  if (!token || !user || isTokenExpired(token)) {
    safeRemove("token");
    safeRemove("user");
    return { user: null, token: null, isAuthenticated: false };
  }

  return { user, token, isAuthenticated: true };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      safeSet("user", JSON.stringify(action.payload.user));
      safeSet("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      safeRemove("user");
      safeRemove("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
