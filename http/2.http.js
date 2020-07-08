let http = require('http');
let fs = require('fs');
let path = require('path');

// 日志记录请求方法 url 头 版本号
let server = http.createServer(function (req, res) {
    let body = [];
    req.on('data', function(data) {
        body.push(data);
    })
    req.on('end', function() {
        let result = Buffer.concat(body);
        console.log(result.toString());
    })
    if (req.url != '/favicon.ico') {
        let out = fs.createWriteStream(path.join(__dirname, 'request.log'));
        out.write('method=' + req.method);
        out.write('\r\nurl=' + req.url);
        out.write('\r\nheaders=' + JSON.stringify(req.headers));
        out.write('\r\nhttpVersion=' + req.httpVersion);
    }
    res.statusCode = 200;
    res.write('hello');
}).listen(8080, '127.0.0.1');