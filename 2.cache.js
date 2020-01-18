const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

http.createServer(async (req, res) => {
  let { pathname } = url.parse(req.url);
  let absPath = path.join(__dirname, pathname);
  console.log('request', pathname);
  try {
    let statObj = await fs.stat(absPath);
    if (statObj.isDirectory()) {
      absPath = path.join(absPath, 'index.html');
      await fs.access(absPath);
    }
    let content = await fs.readFile(absPath, 'utf8');
    let hash = crypto.createHash('md5').update(content).digest('base64');
    // 强制缓存
    res.setHeader('Expires', new Date(Date.now() + 10*1000).toGMTString());
    // compatible with low-level browser
    res.setHeader('Cache-Control', 'max-age=10'); 
    // 协商缓存
    let ctime = statObj.ctime.toGMTString();
    res.setHeader('Last-Modified', ctime);
    res.setHeader('ETag', hash);
    
    let ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince === ctime) {
      res.statusCode = 304;
      return res.end();
    }

    let ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch === hash) {
      res.statusCode = 304;
      return res.end();
    }

    res.end(content);
  } catch(e) {
    res.statusCode = 404;
    res.end('Not Found');
  }
}).listen(3000);
