import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col } from 'react-bootstrap';
import { Box, Grid, Button } from '@mui/material'; // Removed Typography import
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useKeycloak } from "@react-keycloak/web";
import FileUploadComponent from "./FileUploadComponent";
import FileUploadSection from "./FileUploadSection";
import MetadataDescriptionTable from "./MetadataDescriptionTable";
import MetadataCheckModal from "./MetadataCheckModal";

const backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

const CSVUpload = () => {
  const { keycloak } = useKeycloak();
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [metadataCheckStatus, setMetadataCheckStatus] = useState([]);
  const [showUploadAllButton, setShowUploadAllButton] = useState(false);
  const navigate = useNavigate();

  // Function to handle the Upload All button click
  const handleUploadAll = async (event) => {
    event.preventDefault();
    if (!keycloak?.authenticated) return;
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('csv', file));

    try {
      const data = await fetchDataWithToast(`${backend}/upload`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${keycloak.token}` }
      });
      console.log(data);
      //  navigate("/prompting");
    } catch (error) {
      console.error(error);
      toast.error(t("upload_error"));
    }
  };

  // Function to handle the Default Upload button click
  const handleDefaultUpload = async () => {
    if (!keycloak?.authenticated) return;
    try {
      const data = await fetchDataWithToast(`${backend}/upload/defaultupload`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keycloak.token}`
        }
      });
      console.log(data);
      navigate("/prompting");
    } catch (error) {
      console.error(error);
      toast.error(t("default_upload_error"));
    }
  };

  // Handle file drop
  const handleFileDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.filter(file => !selectedFiles.some(selectedFile => selectedFile.name === file.name));
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    setShowUploadAllButton(true); // Show the Upload All button when files are selected
  };

  // Fetch data with toast notifications
  const fetchDataWithToast = (url, requestOptions, file) => {
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
    const toastMessage = file ?
      { pending: `Please wait uploading ${file}`, success: `Successfully upload ${file}`, error: `Error uploading ${file}` } :
      { pending: "Please wait", success: "Success", error: "Error" };
    toast.promise(promise, toastMessage);
    return promise;
  };



  // Configure metadata for the selected file
  const handleConfigureMetadata = (input) => {
    if (!keycloak || !keycloak.authenticated) return;
    const accessToken = keycloak.token;
    // Get the model from localStorage
    const model = localStorage.getItem('selectedModel') || '';
    const schema = typeof input === 'string' ? input : input.name.split('.')[0].toLowerCase();
    setSelectedFileNames(schema);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ schema: schema }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Model': model
      }
    };
    fetchDataWithToast(backend + '/misc/getSchema', requestOptions)
      .then(data => {
        setIsMetadataModalOpen(false)
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
      });
  };


  const handleCloseMetadataModal = () => setTableData([]);
  const handleCloseMetadataConfigModal = () => setIsMetadataModalOpen(false);

  // Check metadata
  const handleCheckMetaData = async () => {
    if (!keycloak?.authenticated) return;
    try {
      const response = await fetch(`${backend}/upload/checkmetadata`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keycloak.token}`
        }
      });
      const status = await response.json();
      setMetadataCheckStatus(status);
      setIsMetadataModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error(t("metadata_check_error"));
    }
  };

  const handleColumnDescriptionChange = (newData) => setTableData(newData);

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      if (newFiles.length === 0) {
        setShowUploadAllButton(false); // Hide Upload All button if no files are left
      }
      return newFiles;
    });
  };

  // Save metadata
  const handleMetaDataSave = async () => {
    if (!keycloak || !keycloak.authenticated) return;
    const accessToken = keycloak.token;
    const model = localStorage.getItem('selectedModel') || '';
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
          'Authorization': `Bearer ${accessToken}`,
          'X-Model': model,
        }
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success('Column description added!', {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTableData([]);
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


  return (
    <div className="data-upload-section">
      <Box
        p={3}
        sx={{
          width: {
            xs: "100%",
            lg: "50%",
          },
        }}
      >
        <h2 style={{ marginBottom: "16px", fontSize: "25px" }}>
          {t("upload_instructions_title")}
        </h2>
        <p style={{ fontSize: "17px" }}>{t("upload_instructions_step1")}</p>
        <p style={{ fontSize: "17px" }}>{t("upload_instructions_step2")}</p>
        <p style={{ fontSize: "17px" }}>{t("upload_instructions_step3")}</p>
        <p style={{ fontSize: "17px" }}>{t("upload_instructions_step4")}</p>
      </Box>
      <Grid
        container
        spacing={1}
        alignItems="center"
        style={{ marginTop: "16px" }}
      >
        <Grid item md={3} xs={12}>
          <FileUploadComponent onFileDrop={handleFileDrop} t={t} />
        </Grid>
        <Grid item md={1} xs={12} container justifyContent="center" alignItems="center">
          {/* Text "OR" */}
          <span
            style={{ margin: "0 10px", textAlign: "center", fontSize: "30px" }}
          >
            OR
          </span>
        </Grid>
        <Grid item md={3} xs={12} container justifyContent="flex-start">
          {/* Test Data Button */}
          <Button
            variant="text"
            className="mt-2"
            onClick={handleDefaultUpload}
            style={{ marginLeft: "0" }}
          >
            {t("menu2_btn_use_testdata")}
          </Button>
        </Grid>
      </Grid>
      <Row>
        <Col md={6} xs={12}>
          <Form>
            <FileUploadSection
              selectedFiles={selectedFiles}
              handleConfigureMetadata={handleConfigureMetadata}
              handleRemoveFile={handleRemoveFile}
              t={t}
            />
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={6} xs={12} style={{ display: "flex", alignItems: "center" }}>
          <Button variant="text" className="mt-2" onClick={handleCheckMetaData}>
            {t("menu2_btn_check_metadata")}
          </Button>
          {/* Upload All Button aligned with Check Metadata button */}
          {showUploadAllButton && (
            <Button
              variant="text"
              className="mt-2"
              onClick={handleUploadAll}
              disabled={!showUploadAllButton}
            >
              {t("menu2_upload_all_btn")}
            </Button>
          )}
          <br />
          <hr style={{ borderTop: "5px solid grey", marginTop: "10px" }} />
          <br />
        </Col>
      </Row>

      {tableData.length > 0 && (
        <MetadataDescriptionTable
          tableData={tableData}
          onColumnDescriptionChange={handleColumnDescriptionChange}
          handleMetaDataSave={handleMetaDataSave}
          handleCloseMetadataModal={handleCloseMetadataModal}
          t={t}
        />
      )}

      <MetadataCheckModal
        isMetadataModalOpen={isMetadataModalOpen}
        handleCloseMetadataConfigModal={handleCloseMetadataConfigModal}
        metadataCheckStatus={metadataCheckStatus}
        handleGearIconClick={handleConfigureMetadata}
        t={t}
      />
      <ToastContainer autoClose={500} />

      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default CSVUpload;
