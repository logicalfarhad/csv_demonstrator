import React, { useMemo }  from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { createTheme, ThemeProvider } from '@mui/material';

const ResultTable = ({ queryResponse }) => {
  // Extract column headers dynamically from the keys of the first item
  const columns = queryResponse.length > 0 ? Object.keys(queryResponse[0]).map((key) => ({
    accessorKey: key,
    header: key,
  })) : [];

  const table = useMaterialReactTable({
    data: queryResponse,
    columns,
  });

  const tableTheme = useMemo(
    () => createTheme({
      typography: {
        fontFamily: '',
      },
    }),
    [],
  );

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialReactTable table={table} />
    </ThemeProvider>
  );
};

export default ResultTable;