// FileUploadSection.js
import React from 'react';
import {Table, Tooltip, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Settings as GearIcon, Clear as ClearIcon } from '@mui/icons-material';

const FileUploadSection = ({ selectedFiles, handleConfigureMetadata, handleRemoveFile, t }) => {
  return (
    <div>
      {selectedFiles.length > 0 && (
        <div>
          <br />
          <h5>{t("menu2_selecedFile_msg")}</h5>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 150 }}>{t("menu2_selectedfile_name")}</TableCell>
                  <TableCell sx={{ width: 250, textAlign: 'center' }}>{t("menu2_selectedfile_action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedFiles.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ minWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'wrap' }}>
                      {file.name}
                    </TableCell>
                    <TableCell sx={{ width: 250, textAlign: 'center' }}>
                      <Tooltip title={t("menu2_metadata_tooltip")} placement="bottom">
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => handleConfigureMetadata(file)}
                        >
                          <GearIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("menu2_remove_file_tooltip")} placement="bottom">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
