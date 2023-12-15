import "./normal.css";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginForm from "./components/login/LoginForm";
import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AboutSection from "./components/AboutSection/AboutSection";

function App() {
  const { token } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return typeof token === "string" && token.length > 0 ? children : <Navigate to="/auth/login" />;
  };

  return (
    <div className="App">
      <Routes>
        <Route
          index
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/introduction" element={<AboutSection />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;