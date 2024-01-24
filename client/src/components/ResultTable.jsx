import React from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

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

  return <MaterialReactTable table={table} />;
};

export default ResultTable;