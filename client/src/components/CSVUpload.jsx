import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Table } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Save, Gear, X } from 'react-bootstrap-icons'; // Import icons from react-bootstrap-icons
import 'bootstrap/dist/css/bootstrap.min.css';
import './toast.css'

let backend = process.env.REACT_APP_BACKEND

const CSVUpload = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [metadataAlertMessage, setMetadataAlertMessage] = useState("");
  const [uploadAlertMessage, setUploadAlertMessage] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [metadataAlertVariant, setMetadataAlertVariant] = useState("success");
  const [uploadAlertVariant, setUploadAlertVariant] = useState("success");
  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleShow = () => {
    setShowModal(true);
    resetForm();
  };


  const resetForm = () => {
    setSelectedFiles([]);
    setMetadataAlertMessage("");
    setMetadataAlertVariant("success");
    setUploadAlertMessage("");
    setUploadAlertVariant("success");
  };

  // Use react-dropzone to handle file selection
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv']
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.filter((file) => !selectedFileNames.includes(file.name));
      setSelectedFiles([...selectedFiles, ...newFiles]);
    },
  });

  const handleConfigureMetadata = async (file) => {
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    let schema = file.name.split('.')[0]
    setSelectedFileNames(schema)
    try {
      const response = await fetch(backend + '/api/misc/getSchema', {
        method: 'POST',
        body: JSON.stringify({ schema: schema }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': bearer
        }
      });
      let data = await response.json();
      console.log(data)
      const uniqueColumnNames = new Set();
      const newData = [];
      for (const item of data) {
        const columnName = item.COLUMN_NAME;
        const Desc = item.description;
        if (!uniqueColumnNames.has(columnName) && columnName !== "id") {
          uniqueColumnNames.add(columnName);
          newData.push({ Column: columnName, Desc: Desc });
        }
      }
      setTableData(newData);
    } catch (error) {
      console.log(error);
    }
    setShowMetadataModal(true);
  };

  const handleCloseMetadataModal = () => {
    setShowMetadataModal(false);
  };


  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };



  const handleMetaDataSave = async () => {
    setIsSaving(true);
    setMetadataAlertMessage("")
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    try {
      const response = await fetch(backend + '/api/misc/saveMetadata', {
        method: 'POST',
        body: JSON.stringify({
          tableData: tableData,
          tableName: selectedFileNames
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': bearer
        }
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setMetadataAlertMessage("Column description added!");
      setMetadataAlertVariant("success");
    } catch (error) {
      setMetadataAlertMessage(error.message);
      setMetadataAlertVariant("danger");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (file) => {
    setIsUploading(true);
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await fetch(backend + '/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': bearer
        },
      });

      await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setUploadAlertMessage("CSV files uploaded successfully!");
      setUploadAlertVariant("success");
    } catch (error) {
      setUploadAlertMessage(error);
      setUploadAlertVariant("danger");
    } finally {
      setIsUploading(false);
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
            {/* Use react-dropzone here */}
            <div {...getRootProps()} style={dropzoneStyles}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the CSV file(s) here...</p>
              ) : (
                <p>Drag 'n' drop CSV file(s) here, or click to select</p>
              )}
            </div>
            {selectedFiles.length > 0 && (
              <div>
                <h5>Selected Files:</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFiles.map((file, index) => (
                      <tr key={index}>
                        <td>{file.name}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleUpload(file)}
                          >
                            <Save size={16} />
                          </Button>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() => handleConfigureMetadata(file)}
                          >
                            <Gear size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMetadataModal} onHide={handleCloseMetadataModal}>
        <Modal.Header closeButton>
          <Modal.Title>Metadata Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button variant="secondary" onClick={handleCloseMetadataModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleMetaDataSave} disabled={isSaving || isUploading}>
            {isSaving ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bootstrap Notification for Upload Success */}
      {uploadAlertMessage && (
        <div
          className={`toast show alert-${uploadAlertVariant}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body">
            {uploadAlertMessage}
          </div>
        </div>
      )}

      {/* Bootstrap Notification for Metadata Save Success */}
      {metadataAlertMessage && (
        <div
          className={`toast show alert-${metadataAlertVariant}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body">
            {metadataAlertMessage}
          </div>
        </div>
      )}
    </>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default CSVUpload;
