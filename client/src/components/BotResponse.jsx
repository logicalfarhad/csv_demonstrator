import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';


import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Row, Col } from 'react-bootstrap';

import Chart from "./Chart"
import PdfDocument from "./PdfDocument" 


const BotResponse = ({ response, queryResponse, question, chatLogRef }) => {
  const [botResoponse, setBotResponse] = useState("");
  const [isPrinting, setIsPrinting] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const [chartImages, setChartImages] = useState([]);
  const chartsContainerRef = useRef(null);


  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showVisualization, setShowVisualization] = useState(false);
  const handleCloseVisualization = () => setShowVisualization(false);
  const handleShowVisualization = () => setShowVisualization(true);

  useEffect(() => {
    let index = 1;
    let msg = setInterval(() => {
      if (response !== " - The Ultimate AI Assistant") {
        setIsButtonVisible(true);
      }
      if (!isPrinting) {
        // if isPrinting is false, clear interval and return
        clearInterval(msg);
        return;
      }
      setBotResponse(response.slice(0, index));
      if (index >= response.length) {
        clearInterval(msg);
        setIsButtonVisible(false);
      }
      index++;

      // scroll to the bottom of the page whenever the messages array is updated
      if (chatLogRef !== undefined) {
        chatLogRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 30);
    return () => clearInterval(msg); // clear interval on component unmount
  }, [chatLogRef, response, isPrinting]);


  const generateImages = async () => {
    setChartImages([]);
    if (chartsContainerRef.current) {
      const chartDivs = chartsContainerRef.current.querySelectorAll('.charts-container > div');
      
      const promises = Array.from(chartDivs).map(async (div, index) => {
        const titleElement = div.querySelector('h3');
        const descriptionElement = div.querySelector('p');
        const canvasElement = div.querySelector('canvas') || div.querySelector('div');


        const chartData = {
          id: index,
          dataUrl: null,
          title: titleElement ? titleElement.textContent : '',
          description: descriptionElement ? descriptionElement.textContent : '',
        };

        /*Commenting this out for now because route is not there and it still using openAI
        Implement route in llama2 and then use it*/
        
        // let field = descriptionElement ? descriptionElement.textContent : '';
        // if(field !== ''){
        //   let prompt = `Based on this sql query response and data ${JSON.stringify(queryResponse)}, Generate one line description for field ${field}`
        //   // console.log(prompt);
        //   try {
        //     const response = await fetch(`http://localhost:4000/openai?prompt=${prompt}`, {
        //       method: "GET",
        //       headers: { "Content-Type": "application/json" },
        //     });
        //     const data = await response.json();
        //     // console.log(data.result);
        //     chartData['description'] = data.result;
        //   } catch (err) {
        //     console.log(err);
        //   }
        // }

        
        const canvas = await html2canvas(canvasElement);
        const imageDataUrl = canvas.toDataURL('image/png');
        chartData.dataUrl = imageDataUrl;
        return chartData;
      });
  
      const chartDataArray = await Promise.all(promises);
      setChartImages(chartDataArray); 
    }
  };



  const stopPrinting = () => setIsPrinting(!isPrinting);

  return (
    <>
      <pre>
        {botResoponse.trim()}
        {botResoponse === response ? "" : "|"}
      </pre>
      {isButtonVisible && (
        <button className="stop-messgage" onClick={stopPrinting}>
          {isPrinting ? "Stop Message" : "Regenerate Message"}
        </button>
      )}

      <br />
      {queryResponse === false && (
        <>
          {!isButtonVisible && (
            <pre style={{ color: "#baf3ff" }}>
              Since this is not a valid SQL query, response couldn't be
              generated from database.
            </pre>
          )}
        </>
      )}

      {queryResponse !== undefined && queryResponse.length && (
        <>
          {/* <Button variant="primary" onClick={handleShow}>
        Show Query Response
      </Button> */}

          {!isButtonVisible && (
            <button className="query-response" onClick={handleShow}>
              Show Query Response
            </button>
          )}
          {/* <button className="query-response" onClick={handleShow}>
            Show Query Response
          </button>
          <button
            className="visualization query-response"
            onClick={handleShowVisualization}
          >
            Show Visualization
          </button> */}

          {!isButtonVisible && (
            <button
              className="visualization query-response"
              onClick={handleShowVisualization}
            >
              Show Visualization/Report
            </button>
          )}

          {!isButtonVisible && (
            <>
              <Row className='response-result'>
                <Col 
                className='col-custom'
                  md={7}
                  xs={12}
                >
                  <pre className="pre-custom">
                    {JSON.stringify(queryResponse, undefined, 2)}
                  </pre>
                </Col>
                <Col 
                className='col-custom'
                  md={5}
                  xs={12}
                >
                  <div
                    className="charts-container"
                    ref={chartsContainerRef}
                  >
                    <Chart data={queryResponse} />
                  </div>
                </Col>
              </Row>
            </>
          )}

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Query Response</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <pre>{JSON.stringify(queryResponse, undefined, 2)}</pre>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showVisualization} onHide={handleCloseVisualization}>
            <Modal.Header closeButton>
              <Modal.Title>Visualization & Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PdfDocument
                aiResponse={botResoponse}
                queryResp={queryResponse}
                chartsImg={chartImages}
                question={question}
              />

              <Button onClick={generateImages}>
                Generate Pdf with visualizations
              </Button>

              {/* <PDFDownloadLink document={<PdfDocument aiResponse={botResoponse} queryResp={queryResponse} question={question} chartsImg={chartImages} />} fileName="somename.pdf">
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download now!'
      }
    </PDFDownloadLink> */}

              <br />
              <br />
              <br />
              <br />
              {/* <div className="charts" ref={chartsContainerRef}>
                <Chart data={queryResponse} />
              </div> */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseVisualization}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default BotResponse;
