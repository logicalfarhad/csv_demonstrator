import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert, Table } from 'react-bootstrap';
let backend = process.env.REACT_APP_BACKEND
const CSVUpload = () => {

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [tableData, setTableData] = useState([]);
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
    setAlertMessage("");
    setAlertVariant("success");
  };



  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleSave = async () => {

    setIsSaving(true);
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    const formData = new FormData();
    formData.append('csv', selectedFile);
    try {
      const response = await fetch(backend + '/api/misc/saveMetadata', {
        method: 'POST',
        body: JSON.stringify(tableData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': bearer
        }
      })
      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setAlertMessage("Column description added!");
      setAlertVariant("success");
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVariant("danger");
    } finally {
      setIsSaving(false);
    }
  };


  const handleUpload = async () => {

    setIsUploading(true);
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    const formData = new FormData();
    formData.append('csv', selectedFile);
    try {
      const response = await fetch(backend + '/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': bearer
        },
      });

      await response.json()
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      try {
        const response = await fetch(backend + '/api/misc/getSchema', {
          method: 'GET',
          headers: {
            'Authorization': bearer
          },
        });
        let data = await response.json()
        const uniqueColumnNames = new Set();
        const newData = [];
        for (const item of data) {
          const columnName = item.COLUMN_NAME;

          if (!uniqueColumnNames.has(columnName)) {
            uniqueColumnNames.add(columnName);
            newData.push({ Column: columnName, Desc: '' });
          }
        }
        setTableData(newData);
      } catch (error) {
          console.log(error)
      }
      setAlertMessage("CSV file uploaded successfully!");
      setAlertVariant("success");
    } catch (error) {
      setAlertMessage(error);
      setAlertVariant("danger");
    } finally {
      setIsUploading(false)
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
          {tableData.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Columns</th>
                  <th>Desc</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        disabled
                        value={data.Column}
                        onChange={(event) => {
                          const newData = [...tableData];
                          newData[index].Column = event.target.value;
                          setTableData(newData);
                        }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={data.Desc}
                        onChange={(event) => {
                          const newData = [...tableData];
                          newData[index].Desc = event.target.value;
                          setTableData(newData);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving || isUploading}>
            {isSaving ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
          <Button variant="info" onClick={handleUpload} disabled={isSaving || isUploading}>
            {isUploading ? <Spinner animation="border" size="sm" /> : "Upload"}
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
