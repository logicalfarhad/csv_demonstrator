import React, { useState } from "react";
import "./signupform.css";
import { useNavigate } from "react-router-dom";
import SvgComponent from "../SvgComponent";
let backend = process.env.REACT_APP_BACKEND
const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(backend + "/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 201) {
        navigate("/login");
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
      <SvgComponent w={50} h={50} stroke="#202123" />
      <h1>Create your account</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div id="signupPassword">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="password"
          />
          {/* eye icon */}
          <i onClick={() => setShowPassword(!showPassword)}>
            {!showPassword ? (
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
        <button type="submit">Continue</button>
        {errorMessage.trim() !== " " && <span>{errorMessage}</span>}
      </form>
    </div>
  );
};

export default SignupForm;
