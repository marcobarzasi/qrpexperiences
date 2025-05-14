const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const lang = "Spagnolo";
const langFile = "es";

fs.createReadStream('./scripts/Traduzioni.tsv')
    .pipe(csv({separator: '\t'}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        let r = {};
        results.forEach((result) => {
            return r[result.ID] = result[lang];
        });

        const jsonString = JSON.stringify(r, null, 2);
        fs.writeFile('./scripts/' + langFile + '.json', jsonString, (err) => {
            if (err) {
                console.error('Error writing file', err);
            } else {
                console.log('Successfully wrote file');
            }
        });
    });