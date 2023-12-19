import React from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const NavbarMenu = () => {
  return (
    <>
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container fluid>
        {/* <Navbar.Brand href="#home">Demonstrator</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#introduction">INTRODUCTION</Nav.Link>
            <Nav.Link href="#data-uploading">DATA UPLOADING</Nav.Link>
            <Nav.Link href="#prompting">PROMPTING</Nav.Link>
          </Nav>
          <Nav>
            <Button variant="secondary">FAQ</Button>
            <Button >
              Auslogen
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
};

export default NavbarMenu;