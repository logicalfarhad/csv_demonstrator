import React, { useEffect, useState } from "react";
import { Row, Image, Container, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import logo from './../images/iais.png';
import loginImage from './../images/AdobeStock_593861804.jpeg';
import Footer from "../components/Footer";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
const Login = () => {
  const { keycloak } = useKeycloak();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [switchState, setSwitchState] = useState(false);
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
  const handleSwitchChange = (event) => {
    const newLocale = event.target.checked ? 'de' : 'en'; // Change locale based on switch state
    setSwitchState(event.target.checked);
    i18n.changeLanguage(newLocale); // Change the locale
  };
  const handleSignup = () => {
    console.log("Signing up...");
    keycloak.register();
  };

  return (
    <>
      <Container fluid className="d-flex align-items-center justify-content-center vh-100">
        <div className="position-absolute top-0 end-0 p-3" style={{ textAlign: 'right' }}>
          <Image src={logo} className="w-50" />
        </div>
        <div className="position-absolute top-0 start-0 p-3">
          <FormControlLabel
            control={<Switch checked={switchState} onChange={handleSwitchChange} />}
            label={t("switchLabel")}
          />
        </div>
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
