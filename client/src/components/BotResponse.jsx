import React, { useEffect } from "react";
import { useState } from "react";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Chart from "./Chart"


const BotResponse = ({ response, queryResponse, chatLogRef }) => {
  const [botResoponse, setBotResponse] = useState("");
  const [isPrinting, setIsPrinting] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

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
              Since this is not a valid SQL query, response couldn't be generated from database.
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
              Show Visualization
            </button>
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
              <Modal.Title>Visualization</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Chart data={queryResponse} />
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
