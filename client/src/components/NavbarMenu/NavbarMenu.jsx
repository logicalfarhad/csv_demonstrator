import React, { useContext } from "react";
import { useLocation } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavbarMenu.css'
let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

const NavbarMenu = () => {
  const { dispatch } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };


  const handleLogout = async () => {
      try {
        let bearer = 'Bearer ' + window.localStorage.getItem("token");
        const response = await fetch(backend + '/misc/truncate', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer
          }
        })
        let data = await response.json();
        console.log(data)
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('prompts');
        dispatch({ type: "LOGOUT" });
        navigate("/");

      } catch (error) {
        console.log("error happen during sign out", error);
      }
    
  };


  return (
    <>
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary topHeader">
      <Container fluid className='topHeaderContainer'>
        {/* <Navbar.Brand href="#home">Demonstrator</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/introduction" active={isActive('/introduction')}>INTRODUCTION</Nav.Link>
            <Nav.Link href="/data-uploading" active={isActive('/data-uploading')}>DATA UPLOADING</Nav.Link>
            <Nav.Link href="/prompting" active={isActive('/prompting')}>PROMPTING</Nav.Link>
          </Nav>
          <Nav>
            {/* <button className='button-primary' style={{margin:'2px'}}>FAQ</button>   */}
            <button className='button-primary' style={{margin:'2px'}} onClick={() => handleLogout()}>
              Log out
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
};

export default NavbarMenu;