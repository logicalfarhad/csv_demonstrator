import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './AboutSection.css'; // Import your CSS file

const AboutSection = () => {
  return (
    <div className="About-section1 text-left">
    <Row>
        <Col md={9}>
          <h4>Welcome to LLM Insight Expert - An intelligent assistant for ad hoc analyses</h4>
          <p className="text-muted">
          Companies often face the challenge of investing considerable resources to gain business-relevant insights from large and complex data sets. Extracting relevant information, analyzing sales trends and predicting customer behavior usually requires specialized skills and a deep understanding of data science. With the LLM Insight Expert, we successfully overcome the challenges and provide an innovative solution for wholesale and retail. Not only does it overcome the existing difficulties in working with data, but it also creates effortless access to critical business information for everyone.
          </p>
        </Col>
        {/* <Col md={4}>
        </Col> */}
      </Row>
      <br />
      <hr style={{borderTop: '5px solid grey'}}/>
      <br />
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
      <br />
      <hr style={{borderTop: '5px solid grey'}}/>
      <br />
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