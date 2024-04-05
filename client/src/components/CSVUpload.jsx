import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useKeycloak } from "@react-keycloak/web";
import Button from '@mui/material/Button';

import FileUploadSection from "./FileUploadSection";
import MetadataCheckModal from "./MetadataCheckModal";
import MetadataDescriptionTable from "./MetadataDescriptionTable";
import FileUploadComponent from "./FileUploadComponent";


const backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

const CSVUpload = () => {
  const { keycloak } = useKeycloak();

  const { t, i18n } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [metadataCheckStatus, setMetadataCheckStatus] = useState([]);
  const [showDefaultUploadButton, setShowDefaultUploadButton] = useState(true);
  const navigate = useNavigate();
  const uploadTooltip = <Tooltip id="upload-tooltip">Upload files</Tooltip>;

  const handleUploadAll = async (event) => {
    try {
      event.preventDefault();
      if (!keycloak || !keycloak.authenticated) return;
      const accessToken = keycloak.token;
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('csv', file);
      });
      const requestOption = {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      const data = await fetchDataWithToast(backend + '/upload', requestOption);
      console.log(data);
      //  navigate("/prompting");
    } catch (error) {
      console.log(error);
      throw new Error(`HTTP error! status: ${error}`);
    }
  };

  const handleDefaultUpload = async () => {
    if (!keycloak || !keycloak.authenticated) return;
    const accessToken = keycloak.token;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    };
    fetchDataWithToast(backend + '/upload/defaultupload', requestOptions)
      .then(data => {
        console.log(data)
        navigate("/prompting");
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFileDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.filter((file) => !selectedFileNames.includes(file.name));
    setSelectedFiles([...selectedFiles, ...newFiles]);
    setShowDefaultUploadButton(newFiles.length > 0 ? false : true);
  };

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

  const handleConfigureMetadata = (file) => {
    if (!keycloak || !keycloak.authenticated) return;
    const accessToken = keycloak.token;
    let schema = file.name.split('.')[0].toLowerCase();
    setSelectedFileNames(schema);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ schema: schema }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
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
      });
  };

  const handleCloseMetadataModal = () => {
    setTableData([]);
  };

  const handleCloseMetadataConfigModal = () => {
    setIsMetadataModalOpen(false);
  };

  const handleCheckMetaData = async () => {
    if (!keycloak || !keycloak.authenticated) return;
    const accessToken = keycloak.token;
    try {
      const response = await fetch(backend + '/upload/checkmetadata', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      let status = await response.json();
      console.log(status);
      setMetadataCheckStatus(status);
      setIsMetadataModalOpen(true);
      console.log(metadataCheckStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const handleColumnDescriptionChange = (newData) => {
    setTableData(newData);
  };

  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleMetaDataSave = async () => {
    if (!keycloak || !keycloak.authenticated) return;
    const accessToken = keycloak.token;
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
          'Authorization': `Bearer ${accessToken}`
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
      <Row>
        <Col md={6} xs={12}>
          {/*<h4>Step 1: Data Uploading</h4>*/}
          <p className="text-left">
            {t("menu2_inst")}
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={6} xs={12}>
          <Form>
            <Col md={4} xs={12}>
              <FileUploadComponent onFileDrop={handleFileDrop} t={t} />
            </Col>

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
        <Col md={6} xs={12}>
          <br />
          <br />
          <Button variant="text" className="mt-2" onClick={handleCheckMetaData}>
            {t("menu2_btn_check_metadata")}
          </Button>
          {showDefaultUploadButton && (
            <Button variant="text" className="mt-2" onClick={handleDefaultUpload} style={{ marginLeft: '10px' }}>
              {t("menu2_btn_use_testdata")}
            </Button>
          )}

          {!showDefaultUploadButton && (
            <OverlayTrigger placement="bottom" overlay={uploadTooltip}>
              <Button variant="text" className="mt-2" onClick={handleUploadAll} style={{ marginLeft: '10px' }}>
                {t("menu2_upload_all_btn")}
              </Button>
            </OverlayTrigger>

          )}
          <br />
          <hr style={{ borderTop: "5px solid grey" }} />
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
        t={t}
      />
      <ToastContainer autoClose={500} />
    </div>
  );
};

export default CSVUpload;
