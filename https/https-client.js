const https = require('https');
const fs = require('fs');
const path = require('path');
const readFileSync = filename => fs.readFileSync(path.resolve(__dirname, filename), 'utf8');

const options = {
    host: 'localhost',
    port: 443,
    path: '/',
    key: readFileSync('./privatekey.pem'),
    cert: readFileSync('./certificate.pem'),
    rejectUnauthorized: false,
};

https.request(options, function(err, response, body) {
    console.log('connected');
    console.log(err);
    console.log(body);
})