import React, { useEffect } from "react";
import { Row, Image, Container, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import loginImage from './../images/LLM_KeyVisual_01.jpg';
import logo from './../images/ki-nrw.png';
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { FaInfoCircle } from "react-icons/fa"; // Importing an info circle icon
import '../style/Login.css';  // Import the CSS file for styling

const Login = () => {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
    <Container fluid className="vh-100 d-flex flex-column">
      <Row className="flex-grow-1 align-items-center">
        <Col xs={12} md={6} className="d-flex flex-column justify-content-center">
          <div className="loginContainerContent">
            <h1 style={{ fontSize: "40px" }} className="text-left">{t("welcomeLabel")}</h1>
            <p style={{ fontSize: "25px" }} className="text-left">{t("description")}</p>
            <p style={{ fontSize: "17px" }} className="text-left">
              {t("summary")}
            </p>
            <p className="text-left">
              <a href="https://www.iais.fraunhofer.de/de/geschaeftsfelder/enterprise-information-integration/llm-insight-expert.html" target="_blank" rel="noopener noreferrer">
                <FaInfoCircle className="icon" /> Mehr Informationen
              </a>
            </p>
            <div className="loginButtonWrapper text-center">
              {!keycloak.authenticated && (
                <>
                  <button id="signupButton" className="button-primary me-2" onClick={handleLogin}>
                    {t("login")}
                  </button>
                  <button id="signupButton" className="button-primary me-2" onClick={handleSignup}>
                    {t("signup")}
                  </button>
                </>
              )}
            </div>
            <div className="logoWrapper">
              <Image src={logo} style={{ width: '190px', height: 'auto' }} />
            </div>
          </div>
        </Col>
        <Col xs={12} md={5} className="d-flex justify-content-center">
          <Image src={loginImage} className="w-100" rounded />
        </Col>
      </Row>
      <Row className="mt-auto">
        <Col>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
