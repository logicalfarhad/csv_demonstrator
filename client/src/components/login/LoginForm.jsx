import React, { useContext, useState } from "react";
import "../../style/signupform.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Image } from 'react-bootstrap';
// import SvgComponent from "../SvgComponent";
import logo from "./../../images/ki-nrw.png"
let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';
const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(backend + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginEmail, loginPassword }),
      });
      const data = await response.json();

      if (response.status === 200) {
        dispatch({ type: "LOGIN", payload: data.token });
        // Introduce a delay before redirection (e.g., 500 milliseconds)
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="signupFormContainer">
      <Image style={{ width: "10%" }}
        src={logo}
      />
      {/* <SvgComponent w={50} h={50} stroke="#202123" /> */}
      <br />
      <h1>Welcome Back</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="loginEmail"
          id="loginEmail"
          placeholder="login email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />
        <div id="signupPassword">
          <input
            type={showLoginPassword ? "text" : "password"}
            name="loginPassword"
            id="loginPassword"
            placeholder="login password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            autoComplete="password"
          />
          {/* eye icon */}
          <i onClick={() => setShowLoginPassword(!showLoginPassword)}>
            {!showLoginPassword ? (
              <svg
                width={26}
                height={26}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  stroke="#202123"
                  strokeWidth={0.792}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5C5.636 5 2 12 2 12s3.636 7 10 7 10-7 10-7-3.636-7-10-7Z" />
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </g>
                <title>Show Password</title>
              </svg>
            ) : (
              <svg
                width={26}
                height={26}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000"
              >
                <path
                  d="M20 14.834C21.308 13.332 22 12 22 12s-3.636-7-10-7a8.595 8.595 0 0 0-2 .236M12 9a2.995 2.995 0 0 1 3 3M3 3l18 18m-9-6a2.997 2.997 0 0 1-2.959-2.5M4.147 9c-.308.345-.585.682-.828 1C2.453 11.128 2 12 2 12s3.636 7 10 7c.341 0 .675-.02 1-.058"
                  stroke="#202123"
                  strokeWidth={0.768}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <title>Hide Password</title>
              </svg>
            )}
          </i>
        </div>
        <button type="submit" className='button-primary'>Continue</button>
        {errorMessage.trim() !== " " && <span>{errorMessage}</span>}
      </form>
    </div>
  );
};

export default LoginForm;
