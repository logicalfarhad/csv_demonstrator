import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
// import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import Header from "../../pages/Header";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import '../../style/NavbarMenu.css'
import { useKeycloak } from "@react-keycloak/web";

let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

const NavbarMenu = () => {
  const { t, i18n } = useTranslation();
  const { keycloak } = useKeycloak();
  // const { dispatch } = useContext(AuthContext);
  const location = useLocation();
  const [selectedModel, setSelectedModel] = useState('gpt'); // Default to "GPT"
  const isActive = (path) => {
    return location.pathname === path;
  };
  const handleLogout = async () => {
    // Ensure Keycloak is initialized and user is authenticated
    if (!keycloak || !keycloak.authenticated) {
      // Handle unauthenticated user
      return;
    }
    const accessToken = keycloak.token;
    try {
      // let bearer = 'Bearer ' + window.localStorage.getItem("token");
      const response = await fetch(backend + '/misc/truncate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      let data = await response.json();
      console.log(data)
      // window.localStorage.removeItem('token');
      window.localStorage.removeItem('prompts');
      // dispatch({ type: "LOGOUT" });
      // navigate("/");
      keycloak.logout()
    } catch (error) {
      console.log("error happen during sign out", error);
    }

  };

    // Load from localStorage on component mount
    useEffect(() => {
      const storedModel = localStorage.getItem('selectedModel');
      if (storedModel) {
        setSelectedModel(storedModel);
      }
    }, []);
  
    // Handle the selection change and save to localStorage
    const handleModelChange = (e) => {
      const modelValue = e.target.value;
      setSelectedModel(modelValue);
      localStorage.setItem('selectedModel', modelValue);
    };
  


  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary topHeader">
        <Container fluid className='topHeaderContainer'>
          <Header/>
          <br />
          <br />
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Item>
                <a href="#/introduction" className={`nav-link ${isActive('/introduction') ? 'active' : ''}`}>{t("menu1_name")}</a>
              </Nav.Item>
              <Nav.Item>
                <a href="#/data-uploading" className={`nav-link ${isActive('/data-uploading') ? 'active' : ''}`}>{t("menu2_name")}</a>
              </Nav.Item>
              <Nav.Item>
                <a href="#/prompting" className={`nav-link ${isActive('/prompting') ? 'active' : ''}`}>{t("menu3_name")}</a>
              </Nav.Item>
            </Nav>

              {/* <button className='button-primary' style={{margin:'2px'}}>FAQ</button>   */}
              {/* <button className='button-primary' style={{margin:'2px'}} onClick={() => handleLogout()}>
              Log out
            </button> */}
            <Nav className="d-flex align-items-center"> 
              <Form.Group controlId="modelSelect" className="d-flex align-items-center mb-0"> 
                <Form.Label className="mb-0 me-2">Model:</Form.Label> 
                <Form.Select aria-label="Select Model"  value={selectedModel} onChange={handleModelChange}>
                  <option value="Gpt-4o">Gpt-4o</option>
                  <option value="Mistral-7B-Instruct-v0.3_t2t">Mistral-7B-Instruct-v0.3_t2t</option>
                </Form.Select>
              </Form.Group>
              {!!keycloak.authenticated && (
                <button className='button-primary' style={{ margin: '2px' }} onClick={() => handleLogout()}>
                  {t("logout")} ({keycloak.tokenParsed.preferred_username})
                </button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarMenu;