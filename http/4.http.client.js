const http = require('http');
const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/',
    method: 'GET',
};
const req = http.request(options, function(res) {
    console.log('状态码', res.statusCode);
    console.log('响应头', JSON.stringify(res.headers));
    res.on('data', chunk => console.log('响应体', chunk.toString()))
});
// req.abort();
req.on('error',console.log);
req.end();