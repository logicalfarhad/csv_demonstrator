import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

const CSVUpload = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleShow = () => {
    setShowModal(true);
    resetForm();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setIsLoading(false);
    setAlertMessage("");
    setAlertVariant("success");
  };



  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSave = async () => {

    setIsLoading(true);
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    const formData = new FormData();
    formData.append('csv', selectedFile);
    let data;
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': bearer
        },
      });

      data = await response.json()
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setAlertMessage("CSV file uploaded successfully!");
      setAlertVariant("success");
      setShowModal(false)
    } catch (error) {
      setAlertMessage(data.message);
      setAlertVariant("danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="sideMenuButton"
        onClick={handleShow}>
        <span>+</span>
        Upload CSV
      </div>

      <Modal show={showModal} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>CSV file upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile">
              <Form.Label>Select a CSV file:</Form.Label>
              <Form.Control type="file" accept=".csv" onChange={handleFileSelect} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
        <Alert variant={alertVariant} show={alertMessage !== ""} onClose={() => setAlertMessage("")} dismissible className="mt-3">
          {alertMessage}
        </Alert>
      </Modal>
    </>
  );
};

export default CSVUpload;
