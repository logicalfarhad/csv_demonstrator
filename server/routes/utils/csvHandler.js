const fs = require('fs');
const csv = require('csv-parser');

const listCSVFiles = (directoryPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const csvFiles = files.filter(file => file.endsWith('.csv') && file.startsWith("vis_") && !file.includes('_old'));
                resolve(csvFiles);
            }
        });
    });
}

const readCsvFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        const data = [];
        let headers = [];

        const readStream = fs.createReadStream(filePath);

        readStream
            .pipe(csv())
            .on('headers', (headerArray) => {
                headers = headerArray;
            })
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve({ headers, data });
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = { listCSVFiles, readCsvFile };
