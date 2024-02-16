import React, { useState } from "react";
import Button from "../components/Button";
import {Row,Image, Container, Col  } from 'react-bootstrap';
// import SvgComponent from "../components/SvgComponent";
import SignupForm from "../components/signup/SignUpForm";
import LoginForm from "../components/login/LoginForm";
import { useNavigate } from "react-router-dom";
import loginImage from './../images/AdobeStock_593861804.jpeg'
import logo from './../images/iais.png'

const Login = () => {
  const [isSignupFormVisible, setIsSignupFormVisible] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);

  const navigate = useNavigate();

  const handleClick = async (purpose) => {
    if (purpose === "signup") {
      setIsSignupFormVisible(true);
    }
    if (purpose === "login") {
      setIsLoginFormVisible(true);
      // navigate("/login");
    }
  };

  const handleSignupSuccess = (success) => {
    setIsSignupFormVisible(false);
    setIsLoginFormVisible(success);
    // You can perform other actions here if needed
  };

  return (
    <>
      <Container
        fluid
        className="d-flex align-items-center justify-content-center vh-100"
      >
        <div className="position-absolute top-0 end-0 p-3" style={{ textAlign: 'right' }}>
          {/* <p>LOGO</p> */}
          <Image
            src={logo}
            className="w-50"
          />
          {/* <SvgComponent w={50} h={50} /> */}
        </div>
        <Row>
          <Col xs={12} md={6} className="text-center mb-md-0 mb-3">
            {!isSignupFormVisible && !isLoginFormVisible ? (
              <div className="loginContainer">
                <div className="loginContainerContent">
                  {/* <SvgComponent w={50} h={50} /> */}
                  <h1>Welcome to LLM Insight Expert​</h1>
                  <p>An intelligent assistant for ad hoc analyses</p>
                  <div className="loginButtonWrapper">
                    <Button
                      text="Log in"
                      handleClick={() => handleClick("login")}
                    />
                    <Button
                      text="Sign up"
                      handleClick={() => handleClick("signup")}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {isSignupFormVisible && !isLoginFormVisible && <SignupForm onSignupSuccess={handleSignupSuccess} />}

            {!isSignupFormVisible && isLoginFormVisible && <LoginForm />}
          </Col>
          {/* <Col xs={12} md={2}></Col> */}
          <Col xs={12} md={6}>
            <div className="d-flex justify-content-center">
              <Image
                src={loginImage}
                className="w-100"
                rounded
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
