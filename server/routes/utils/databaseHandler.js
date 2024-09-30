const db = require('../../config/db');
const connection = db.dbConnect();

const generateSqlQueries = async (tableName, headers, data, databaseName) => {
    let tableSchema = `CREATE DATABASE IF NOT EXISTS ${databaseName}; USE ${databaseName};\n`;
    tableSchema += `DROP TABLE IF EXISTS ${tableName};\n`;
    tableSchema += `CREATE TABLE ${tableName} (\n`;

    let idFieldAdded = false;
    let insertStatement = `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES\n`;
    const columns = {};

    // Process data
    for (const row of data) {
        if (Object.keys(row).length !== 0) {
            if (!idFieldAdded) {
                tableSchema += '  id INT AUTO_INCREMENT PRIMARY KEY,\n';
                idFieldAdded = true;
            }

            let values = '(';

            for (const [columnName, value] of Object.entries(row)) {
                // Handle empty strings for numeric columns
                if (value === '' && columns[columnName] && columns[columnName] !== 'VARCHAR(255)') {
                    values += `NULL, `;
                } else {
                    values += `${connection.escape(value.trim())}, `;
                    if (!columns[columnName]) {
                        columns[columnName] = determineDataType(value);
                    }
                }
            }

            values = values.slice(0, -2);
            values += '),\n';
            insertStatement += values;
        }
    }

    // Remove the last comma and newline from the insert statement
    insertStatement = insertStatement.slice(0, -2);
    insertStatement += ';\n';

    // Finalize table schema
    tableSchema = Object.entries(columns).reduce((schema, [columnName, dataType]) => {
        schema += `  ${columnName} ${dataType},\n`;
        return schema;
    }, tableSchema);

    tableSchema = tableSchema.slice(0, -2);
    tableSchema += '\n);';

    return { tableSchema, insertStatement };
}

const determineDataType = (value) => {
    if (!isNaN(value) && value !== '') {
        return Number.isInteger(parseFloat(value)) ? 'INT' : 'FLOAT';
    } else {
        return 'VARCHAR(255)';
    }
}

const checkMetadataTableExists = (tableNames) => {
    return tableNames
        .filter(tableName => !tableName.startsWith("metadata_"))
        .map(tableName => ({
            table_name: tableName,
            exists: tableNames.includes(`metadata_${tableName}`)
        }));
}

module.exports = { generateSqlQueries, checkMetadataTableExists };
