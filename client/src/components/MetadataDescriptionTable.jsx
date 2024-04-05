import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Button, Grid, TextField } from "@mui/material";


const MetadataDescriptionTable = ({
  tableData,
  onColumnDescriptionChange,
  handleMetaDataSave,
  handleCloseMetadataModal,
  t,
}) => {
  const handleColumnChange = (event, index) => {
    const newData = [...tableData];
    newData[index].Column = event.target.value;
    onColumnDescriptionChange(newData);
  };

  const handleDescriptionChange = (event, index) => {
    const newData = [...tableData];
    newData[index].Desc = event.target.value;
    onColumnDescriptionChange(newData);
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <h4>{t("menu2_metadadesc_title")}</h4>
          <TableContainer component={Paper}>
            <Table aria-label="metadata description table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("menu2_metadata_table_column")}</TableCell>
                  <TableCell>{t("menu2_metadata_table_desc")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        disabled
                        value={data.Column}
                        onChange={(event) => handleColumnChange(event, index)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={data.Desc}
                        onChange={(event) => handleDescriptionChange(event, index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div>
            <br/>
            <Button
              variant="text"
              onClick={handleMetaDataSave}
              style={{ marginRight: 8 }}
            >
              {t("menu2_save")}
            </Button>
            <Button variant="text" onClick={handleCloseMetadataModal}>
              {t("menu2_cancel")}
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MetadataDescriptionTable;



