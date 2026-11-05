import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as reduxLogout } from "../redux/authSlice";
import { apiSlice } from "../redux/apiSlice";

export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  function logout() {
    dispatch(reduxLogout());
    // Clear cached API data so the next user never sees the previous user's records
    dispatch(apiSlice.util.resetApiState());
  }

  return {
    user,
    logout,
  };
}
