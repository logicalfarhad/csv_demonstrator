import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const MetadataCheckModal = ({ isMetadataModalOpen, handleCloseMetadataConfigModal, metadataCheckStatus, t }) => {
  return (
    <div>
      <Dialog
        open={isMetadataModalOpen}
        keepMounted
        onClose={handleCloseMetadataConfigModal}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{t("metadata_configuration_status_title")}</DialogTitle>
        <DialogContent>
          {metadataCheckStatus.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("metadata_table_name")}</TableCell>
                    <TableCell>{t("metadata_table_status")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metadataCheckStatus.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.table_name}</TableCell>
                      <TableCell>
                        {item.exists ? (
                          <span style={{ color: 'green' }}><CheckCircleIcon /> {t("metadata_configuration_status_ok")}</span>
                        ) : (
                          <span style={{ color: 'red' }}><CancelIcon /> {t("metadata_configuration_status_not_configured")}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Card>
              <CardContent>
                <p>{t("menu2_nofile")}</p>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMetadataConfigModal}>{t("menu2_cancel")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MetadataCheckModal;
