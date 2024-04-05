import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './AboutSection.css'; // Import your CSS file
import image1 from './../../images/AdobeStock_672055378.jpeg'
import image2 from './../../images/AdobeStock_652599102.jpeg'
import image3 from './../../images/AdobeStock_127541998.jpeg'
import { useTranslation } from "react-i18next";
const AboutSection = () => {

  const { t, i18n } = useTranslation();
  return (
    <div className="About-section1 text-left">
      <Row>
        <Col md={9}>
          <h4>{t("menu1_section1_title")}</h4>
          <p className="text-muted">
            {t("menu1_section1_summary")}
          </p>
        </Col>
        {/* <Col md={4}>
        </Col> */}
      </Row>
      <br />
      <hr style={{ borderTop: '5px solid grey' }} />
      <br />
      <Row className='align-items-center'>
        <Col md={6}>
          <h4 className="subheading">
            {t("menu1_section2_title")}
          </h4>
          <p className="text-muted">
            {t("menu1_section2_summary")}
          </p>
        </Col>
        <Col md={6} className="About-img">
          <Image
            src={image1}
            fluid
            alt=""
            rounded
          />
        </Col>
      </Row>
      <br />
      <hr style={{ borderTop: '5px solid grey' }} />
      <br />
      <Row className='align-items-center'>
        <Col md={6} className="About-img">
          <Image
            src={image2}
            fluid
            alt=""
            rounded
          />
        </Col>
        <Col md={6}>
          <h4 className="subheading">
            {t("menu1_section3_title")}
          </h4>
          <p className="text-muted">
            {t("menu1_section3_summary")}
          </p>
        </Col>
      </Row>
      <br />
      <hr style={{ borderTop: '5px solid grey' }} />
      <br />
      <Row className='align-items-center'>
        <Col md={6}>
          <h4 className="subheading">
            {t("menu1_section4_title")}
          </h4>
          <p className="text-muted">
            {t("menu1_section4_summary")}
          </p>
        </Col>
        <Col md={6} className="About-img">
          <Image
            src={image3}
            fluid
            alt=""
            rounded
          />
        </Col>
      </Row>
    </div>
  );
};

export default AboutSection;