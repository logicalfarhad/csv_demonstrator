import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './AboutSection.css'; // Import your CSS file
import image1 from './../../images/AdobeStock_672055378.jpeg'
import image2 from './../../images/AdobeStock_652599102.jpeg'
import image3 from './../../images/AdobeStock_127541998.jpeg'

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
          Data Uploading: Simplified Uploading and Metadata Handling
          </h4>
          <p className="text-muted">
          Streamline your data analysis with LLM Insight Expert's seamless data uploading feature. With support for CSV file formats, users can effortlessly import various datasets directly into the system. Our interface provides intuitive tools for managing your files, allowing you to update metadata and annotate individual columns with descriptive labels. This clarifies the content and context of your data, setting the stage for more accurate and meaningful insights. Whether you’re working with sales figures, customer demographics, or complex transaction records, LLM Insight Expert ensures that the preparation of your data is as straightforward as the analysis that follows.
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
      <hr style={{borderTop: '5px solid grey'}}/>
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
          Prompting: Natural Language Data Interaction
          </h4>
          <p className="text-muted">
          The 'Prompting' section of LLM Insight Expert is designed for straightforward and direct data interrogation. Users can input queries in natural language within a chat interface, which are then automatically translated into SQL queries by the system. The resulting data retrieval is processed and the answers are structured for clarity and relevance. The system can provide dataset overviews, answer complex queries for detailed business intelligence, and even generate explanations of data patterns. Responses are tailored to the nature of the data, presented in textual summaries, organized tables, or visualized through various chart types—including bar, line, pie charts, or geographical maps for locational data. This functionality transforms data interaction into a more efficient and user-friendly experience, bridging the gap between natural language and database querying.​
          </p>
        </Col>
      </Row>
      <br />
      <hr style={{borderTop: '5px solid grey'}}/>
      <br />
      <Row className='align-items-center'>
        <Col md={6}>
          <h4 className="subheading">
          PDF Report Generation: Automatic Documentation​
          </h4>
          <p className="text-muted">
          This feature enables users to convert the outcomes of their data queries into PDF documents. After performing data analysis through natural language interactions, the system can automatically compile the results, including textual data and visualizations, into a formatted report. This process facilitates the efficient creation of reports that are ready for review, sharing, or archival purposes, enhancing productivity and communication of insights.
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