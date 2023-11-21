import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Gear, X, Save } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

const CSVUpload = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [columnNameTable, setColumnNameTable] = useState([]);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false)
  const [metadataCheckStatus, setMetadataCheckStatus] = useState([]);

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleShow = () => {
    setShowModal(true);
    resetForm();
  };

  const handleShowTableModal = () => {
    setShowTableModal(true);
  };

  const handleTableSelectToggle = (index) => {
    const updatedColumnNameTable = [...columnNameTable];
    updatedColumnNameTable[index].selected = !updatedColumnNameTable[index].selected;
    setColumnNameTable(updatedColumnNameTable);
  };

  const renderTableModalFooter = () => {
    if (columnNameTable.length > 0) {
      return (
        <>
          <Button variant="primary" onClick={handleJoinModal}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleCloseTableModal}>
            No
          </Button>
        </>
      );
    } else {
      return (
        <Button variant="secondary" onClick={handleCloseTableModal}>
          Close
        </Button>
      );
    }
  };

  const handleCloseTableModal = async () => {
    const tableNamesToJoin = new Set(
      columnNameTable.filter((table) => table.selected)
        .map((table) => table.tableNames)
        .flat()
    );
    let bearer = 'Bearer ' + window.localStorage.getItem("token");

    try {
      const response = await fetch(backend + '/upload/jointables', {
        method: 'POST',
        body: JSON.stringify({ tables: [...tableNamesToJoin], shouldJoin: false }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': bearer
        }
      });

      if (response.ok) {
        await response.json();
        setShowTableModal(false);
        toast.success('CSV uploaded without joining!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error('Error joining tables!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('Error joining tables!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    if (columnNameTable.length > 0) {
      handleShowTableModal();
    }
  }, [columnNameTable]);

  const handleJoinModal = async () => {
    const tableNamesToJoin = new Set(
      columnNameTable.filter((table) => table.selected)
        .map((table) => table.tableNames)
        .flat()
    );
    let bearer = 'Bearer ' + window.localStorage.getItem("token");

    try {
      const response = await fetch(backend + '/upload/jointables', {
        method: 'POST',
        body: JSON.stringify({ tables: [...tableNamesToJoin], shouldJoin: true }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': bearer
        }
      });

      if (response.ok) {
        await response.json();
        setShowTableModal(false);
        toast.success('Tables joined successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error('Error joining tables!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('Error joining tables!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv']
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.filter((file) => !selectedFileNames.includes(file.name));
      setSelectedFiles([...selectedFiles, ...newFiles]);
    },
  });


  const getColumnName = async () => {
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    try {
      const response = await fetch(backend + '/upload/gettables', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': bearer
        }
      });
      let data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataWithToast = (url, requestOptions) => {
    const promise = new Promise((resolve, reject) => {
      fetch(url, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });

    toast.promise(promise, {
      pending: "Please wait",
      success: "Success",
      error: "Error",
    });

    return promise;
  };

  const handleConfigureMetadata = (file) => {
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    let schema = file.name.split('.')[0].toLowerCase();
    setSelectedFileNames(schema);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ schema: schema }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': bearer
      }
    };

    fetchDataWithToast(backend + '/misc/getSchema', requestOptions)
      .then(data => {
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
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setShowMetadataModal(true);
      });
  };


  const handleCloseMetadataModal = () => {
    setShowMetadataModal(false);
  };
  const handleCloseMetadataConfigModal = () => {
    setIsMetadataModalOpen(false);
  };

  const handleCheckMetaData = async () => {
    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    try {
      const response = await fetch(backend + '/upload/checkmetadata', {
        method: 'POST',
        //  body: JSON.stringify({ tableNames: [...tableNames] }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': bearer
        }
      });
      let status = await response.json();
      //  console.log(status);
      setMetadataCheckStatus(status);
      setIsMetadataModalOpen(true); // Open the Metadata Configuration modal
      console.log(metadataCheckStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleMetaDataSave = async () => {
    let bearer = 'Bearer ' + window.localStorage.getItem("token");

    try {
      const response = await fetch(backend + '/misc/saveMetadata', {
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
      if (response.ok) {
        toast.success('Column description added!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      toast.error('Error saving metadata!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error(error);
    }
  };

  const handleUpload = async (file) => {

    let bearer = 'Bearer ' + window.localStorage.getItem("token");
    const formData = new FormData();
    formData.append('csv', file);

    const requestOption = {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': bearer
      }
    };

    fetchDataWithToast(backend + '/upload', requestOption)
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.log(error);
        throw new Error(`HTTP error! status: ${error}`);
      })
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
                            <Save size={14} />
                          </Button>

                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() => handleConfigureMetadata(file)}
                          >
                            <Gear size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X size={14} />
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
          {/* Check Columns button with disabled attribute 
          <Button
            variant="primary"
            onClick={handleShowTableModal}
          >
            Check Columns
          </Button>
          */}
          {/* Check Metadata button with disabled attribute */}
          <Button
            variant="primary"
            onClick={handleCheckMetaData}
          >
            Check Metadata
          </Button>
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
          <Button variant="primary" onClick={handleMetaDataSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isMetadataModalOpen} onHide={handleCloseMetadataConfigModal}>
        <Modal.Header closeButton>
          <Modal.Title>Metadata Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {metadataCheckStatus.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Table Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {metadataCheckStatus.map((item, index) => (
                  <tr key={index}>
                    <td>{item.table_name}</td>
                    <td>
                      {item.exists ? (
                        <span>&#10004; Configured</span>
                      ) : (
                        <span>&#10008; Not Configured</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>You have not uploaded any files</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMetadataConfigModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showTableModal} onHide={handleCloseTableModal}>
        <Modal.Header closeButton>
          <Modal.Title>Do you want to join these tables?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {columnNameTable.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Common Column</th>
                  <th>Table</th>
                </tr>
              </thead>
              <tbody>
                {columnNameTable.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleTableSelectToggle(index)}
                      />
                    </td>
                    <td>{item.columnName}</td>
                    <td>{item.tableNames.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>There are no common column names.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {renderTableModalFooter()}
        </Modal.Footer>
      </Modal>
      <ToastContainer autoClose={500} />
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
