import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import '../../style/AboutSection.css'; // Import your CSS file
import image1 from './../../images/LLM_Visual_01.jpg';
import image2 from './../../images/LLM_Visual_02.jpg';
import image3 from './../../images/LLM_Visual_03.jpg';
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <div className="About-section1 text-left">
      <Row>
        <Col md={9}>
          <h4>{t("menu1_section1_title")}</h4>
          <p className="text-muted">{t("menu1_section1_summary")}</p>
        </Col>
      </Row>
      <br />
      <hr className="section-divider" />
      <br />
      <Row className='align-items-center'>
        <Col md={6}>
          <h4 className="subheading">{t("menu1_section2_title")}</h4>
          <p className="text-muted"
            dangerouslySetInnerHTML={{ __html: t("menu1_section2_summary") }}
          />
        </Col>
        <Col md={6} className="About-img">
          <Image
            src={image1}
            fluid
            alt={t("menu1_section2_image_alt")}
            rounded
          />
        </Col>
      </Row>
      <br />
      <hr className="section-divider" />
      <br />
      <Row className='align-items-center'>
        <Col md={6} className="About-img">
          <Image
            src={image2}
            fluid
            alt={t("menu1_section3_image_alt")}
            rounded
          />
        </Col>
        <Col md={6}>
          <h4 className="subheading">{t("menu1_section3_title")}</h4>
          <p className="text-muted">{t("menu1_section3_summary")}</p>
        </Col>
      </Row>
      <br />
      <hr className="section-divider" />
      <br />
      <Row className='align-items-center'>
        <Col md={6}>
          <h4 className="subheading">{t("menu1_section4_title")}</h4>
          <p className="text-muted">{t("menu1_section4_summary")}</p>
        </Col>
        <Col md={6} className="About-img">
          <Image
            src={image3}
            fluid
            alt={t("menu1_section4_image_alt")}
            rounded
          />
        </Col>
      </Row>
    </div>
  );
};

export default AboutSection;
