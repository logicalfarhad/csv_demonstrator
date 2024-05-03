import React, { useEffect } from "react";
import { Row, Image, Container, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import loginImage from './../images/AdobeStock_593861804.jpeg';
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
const Login = () => {
  const { keycloak } = useKeycloak();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect if user is authenticated and on the login page
    if (keycloak.authenticated && location.pathname === "/") {
      navigate('/introduction');
    }
  }, [keycloak.authenticated, navigate, location.pathname]);

  const handleLogin = () => {
    console.log("Logging in...");
    keycloak.login();
  };
  const handleSignup = () => {
    console.log("Signing up...");
    keycloak.register();
  };

  return (
    <>
      <Container fluid className="d-flex align-items-center justify-content-center vh-100">

        <Row>
          <Col xs={12} md={6} className="text-center mb-md-0 mb-3">
            <div className="loginContainer">
              <div className="loginContainerContent">
                <h1>{t("welcomeLabel")}​</h1>
                <p>{t("description")}</p>
                <div className="loginButtonWrapper">
                  {!keycloak.authenticated && (
                    <button id="loginButton" className="button-primary" text="Log in" onClick={handleLogin} >{t("login")}</button>
                  )}
                  {!keycloak.authenticated && (
                    <button id="loginButton" className="button-primary" text="Sign up" onClick={handleSignup} > {t("signup")}</button>
                  )}
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="d-flex justify-content-center">
              <Image src={loginImage} className="w-100" rounded />
            </div>
          </Col>
        </Row>

      </Container>
      <Footer />
    </>
  );
};

export default Login;
