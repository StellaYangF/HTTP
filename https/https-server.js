const https = require('https');
const fs = require('fs');
const path = require('path');

let key = fs.readFileSync(path.resolve(__dirname, './privatekey.pem'), 'utf8');
// CA 机构颁发的证书
let cert = fs.readFileSync(path.resolve(__dirname, './certificate.pem'), 'utf8');

const options = {
    key,
    cert,
};

https.createServer(options, function(req, res) {
    res.end('hello');
}).listen(443);