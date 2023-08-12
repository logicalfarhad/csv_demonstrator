import { createContext, useEffect, useReducer } from "react";
import reducer from "./AuthReducer";

const initialState = {
  token: window.localStorage.getItem("token") || null
};

export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (typeof state.token === "string" && state.token.length > 0) {
      window.localStorage.setItem("token", state.token);
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ token: state.token, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};