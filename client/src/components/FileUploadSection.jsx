// FileUploadSection.js
import React from 'react';
import { Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Gear, X } from 'react-bootstrap-icons';

const FileUploadSection = ({ selectedFiles, handleConfigureMetadata, handleRemoveFile, t }) => {
  const metadataTooltip = <Tooltip id="metadata-tooltip">{t("menu2_metadata_tooltip")}</Tooltip>;

  return (
    <div>
      {selectedFiles.length > 0 && (

        <div>
          <br />
          <h5>{t("menu2_selecedFile_msg")}</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>{t("menu2_selectedfile_name")}</th>
                <th>{t("menu2_selectedfile_action")}</th>
              </tr>
            </thead>
            <tbody>
              {selectedFiles.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>
                    <OverlayTrigger placement="bottom" overlay={metadataTooltip}>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleConfigureMetadata(file)}
                      >
                        <Gear size={14} />
                      </Button>
                    </OverlayTrigger>
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
    </div>
  );
};

export default FileUploadSection;
