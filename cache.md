## 缓存策略
- 强制缓存
- 对比缓存（协商缓存）

### 强制缓存
#### 响应状态码 `200`
#### 报文设置 
- 属性值 `max-age=10` 单位为s
    - `res.setHeader('Cache-Control', 'max-age=10')`
- 过期时间 `Expires` 兼容低版本
    - `res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());`

### 对比缓存（协商缓存）
#### 相应状态码 `304`
`res.statusCode = 304`

#### 报文设置
- 时间对比
    - **res.setHeader('Last-Modified', ctime);**
- 内容对比
  - **res.setHeader('ETag', hash);**
> `ctime` 为文件最后修改时间，`ETag` 为文件内容生成的 hash 值

### 强制、协商 缓存对比

#### Response Headers
 - `Expires`: Sat, 18 Jan 2020 02:02:55 GMT
 - `Cache-Control`: max-age=10
 - `ETag`: MfjkEIRTaucN3+DwyqL0Aw==
 - `Last-Modified`: Fri, 17 Jan 2020 08:11:05 GMT

> 请求头报文，在满足条件的第二次请求时，才会有
#### Request Headers
 - `If-Modified-Since`: Fri, 17 Jan 2020 08:11:05 GMT
 - `If-None-Match`: MfjkEIRTaucN3+DwyqL0Aw==

### 其他缓存设置
- 每次都访问服务端
    - **res.setHeader('Cache-Control',`'no-cache'`);**
- 客户端不缓存
    - **res.setHeader('Cache-Control',`'no-store'`);**

### 代码实现
#### 引入 `Node` 模块
```js
const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
```

#### 创建服务 实现接口
```js
http.createServer(async (req, res) => {
  let { pathname } = url.parse(req.url);
  let absPath = path.join(__dirname, pathname);
  try {
    // 文件信息
    let statObj = await fs.stat(absPath);
    if (statObj.isDirectory()) {
      // 根路径 默认读取 index.html 文件
      absPath = path.join(absPath, 'index.html');
      // 文件是否存在
      await fs.access(absPath);
    }
    // 文件内容
    let content = await fs.readFile(absPath, 'utf8');
    // crypto 摘要加密 获取 hash 值
    let hash = crypto.createHash('md5').update(content).digest('base64');
    // 文件 最后修改时间
    let ctime = statObj.ctime.toGMTString();

    // compatible with low-level browser
    res.setHeader('Expires', new Date(Date.now() + 10*1000).toGMTString());
    res.setHeader('Cache-Control', 'max-age=10'); 
    res.setHeader('Last-Modified', ctime);
    res.setHeader('ETag', hash);
    
    // 对比 文件最后修改时间 一致 走协商缓存
    let ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince === ctime) {
      res.statusCode = 304;
      return res.end();
    }

    // 对比 请求/相应携带的 hash  反推内容 一致 走协商缓存
    let ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch === hash) {
      res.statusCode = 304;
      return res.end();
    }

    // 强制、协商缓存 都不满足时 重新相应最新内容
    res.end(content);
  } catch(e) {
    res.statusCode = 404;
    res.end('Not Found');
  }
}).listen(3000);
```