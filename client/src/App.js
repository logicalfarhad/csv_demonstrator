import "./normal.css";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginForm from "./components/login/LoginForm";
import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
function App() {
  const { token } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return typeof token === "string" && token.length > 0 ? children : <Navigate to="/demonstrator/auth/login" />;
  };

  return (
    <div className="App">
      <Routes>
        <Route
          index
          exact
          path="/demonstrator"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route exact path="/demonstrator/auth/login" element={<Login />} />
        <Route exact path="/demonstrator/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;