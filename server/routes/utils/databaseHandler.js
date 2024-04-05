const { MYSQL_DATABASE } = process.env;
const db = require('../../config/db');
const connection = db.dbConnect();
const generateSqlQueries = async (tableName, headers, data) => {
    let tableSchema = `USE ${MYSQL_DATABASE};\n`;
    tableSchema += `DROP TABLE IF EXISTS ${tableName};\n`;
    tableSchema += `CREATE TABLE ${tableName} (\n`;

    let idFieldAdded = false;
    let insertStatement = `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES\n`;
    const columns = {};

    // Process headers
    const foreignKeyColumns = headers.filter(columnName => columnName.includes("FK"));

    // Process data
    for (const row of data) {
        if (Object.keys(row).length !== 0) {
            if (!idFieldAdded) {
                tableSchema += '  id INT AUTO_INCREMENT PRIMARY KEY,\n';
                idFieldAdded = true;
            }

            let values = '(';

            for (const [columnName, value] of Object.entries(row)) {
                if (foreignKeyColumns.includes(columnName)) {
                    const foreignKeyValue = row[columnName];
                    const foreignTable = columnName.split("_")[0].toLowerCase();

                    // Make a SQL query to retrieve the corresponding foreign key value
                    const foreignKeyQuery = `SELECT id FROM ${foreignTable} WHERE Name='${foreignKeyValue}';`;
                    const [rows] = await connection.query(foreignKeyQuery);
                    const foreignKeyValueFromQuery = rows[0].id;

                    values += `${foreignKeyValueFromQuery}, `;
                    if (!columns[columnName]) {
                        columns[columnName] = isNaN(value) ? 'VARCHAR(255)' : 'INT';
                    }
                } else {
                    values += `${connection.escape(value.trim())}, `;
                    if (!columns[columnName]) {
                        columns[columnName] = isNaN(value) ? 'VARCHAR(255)' : 'INT';
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

    tableSchema = Object.entries(columns).reduce((schema, [columnName, dataType]) => {

        if (columnName.includes("FK")) {
            let foreign_table = columnName.split("_")[0];
            schema += `  ${foreign_table}Id INT,\n`;
            schema += `  FOREIGN KEY (${foreign_table}Id) REFERENCES ${foreign_table.toLowerCase()}(id),\n`;
        } else {
            schema += `  ${columnName} ${dataType},\n`;
        }

        return schema;
    }, tableSchema);

    tableSchema = tableSchema.slice(0, -2);
    tableSchema += '\n);';

    return { tableSchema, insertStatement };
}

const checkMetadataTableExists = (tableNames) => {
    const result = [];

    for (const tableName of tableNames) {
        if (!tableName.startsWith("metadata_")) {
            const metadataTableName = `metadata_${tableName}`;
            const metadataTableExists = tableNames.includes(metadataTableName);
            const tableInfo = {
                table_name: tableName,
                exists: metadataTableExists,
            };

            result.push(tableInfo);
        }
    }

    return result;
}

module.exports = { generateSqlQueries, checkMetadataTableExists };
