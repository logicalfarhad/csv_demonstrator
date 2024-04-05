import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const MetadataCheckModal = ({ isMetadataModalOpen, handleCloseMetadataConfigModal, metadataCheckStatus }) => {
  return (
    <div>
      <Dialog
        open={isMetadataModalOpen}
        keepMounted
        onClose={handleCloseMetadataConfigModal}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Metadata Configuration Status"}</DialogTitle>
        <DialogContent>
          {metadataCheckStatus.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Table Name</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metadataCheckStatus.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.table_name}</TableCell>
                      <TableCell>
                        {item.exists ? (
                          <span style={{ color: 'green' }}><CheckCircleIcon /> Configured</span>
                        ) : (
                          <span style={{ color: 'red' }}><CancelIcon /> Not Configured</span>
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
                <p>You have not uploaded any files</p>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMetadataConfigModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MetadataCheckModal;
