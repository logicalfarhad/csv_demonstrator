import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './AboutSection.css'; // Import your CSS file

const AboutSection = () => {
  return (
    <div className="About-section1 text-left">
    <Row>
        <Col md={9}>
          <h4>Demonstrator</h4>
          <p className="text-muted">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </Col>
        {/* <Col md={4}>
        </Col> */}
      </Row>

      <Row className='align-items-center'>
        <Col md={6}>
          <h4 className="subheading">
            Inhalt 1
          </h4>
          <p className="text-muted">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </Col>
        <Col md={6} className="About-img">
          <Image
            src="https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=696&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            fluid
            alt=""
            rounded
          />
        </Col>
      </Row>
      
      <Row className='align-items-center'>
        <Col md={6} className="About-img">
          <Image
            src="https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=696&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            fluid
            alt=""
            rounded
          />
        </Col>
        <Col md={6}>
          <h4 className="subheading">
            Inhalt 2
          </h4>
          <p className="text-muted">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default AboutSection;