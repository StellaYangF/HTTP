# http 服务

## node 内置模块

### `url` 解析或格式化 url 地址
```bash
url.parse(urlStr,[parseQueryString]);
```

```js
const querystring = require('querystring');

let result = querystring.parse('name=stella&age=18', '&');
/**
 * { name: 'stella', age: '18' }
*/
```

### `querystring` 转化 URL 字符串和查询字符串
```bash
querystring.parse(str,[sep],[eq],[options]);
```

```js
const url = require('url');

let result = url.parse('http://stella:123@localhost:8080/list?index=1#title');

/**
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'stella:123',
  host: 'localhost:8080',
  port: '8080',
  hostname: 'localhost',
  hash: '#title',
  search: '?index=1',
  query: 'index=1',
  pathname: '/list',
  path: '/list?index=1',
  href: 'http://stella:123@localhost:8080/list?index=1#title'
}
*/

// 传入参数二，则将 query 解析为对象格式
let result = url.parse('http://stella:123@localhost:8080/list?index=1#title', true);
/**
 * ...
 * query: { index: '1' },
 * ...
*/
```

# https

## 下载及初始化文件

* [下载openssl](https://dl.pconline.com.cn/download/355862-1.html)
* 添加环境变量
* 创建私钥 
  ```bash
  openssl genrsa -out privatekey.pem 1024
  ```
* 创建证书签名请求
  ```bash
  openssl req -new -key privatekey.pem -out certrequest.csr
  ```

## 创建 https 服务器

https-server.js
```js
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
```

## 下载 nginx 和 git
```bash
yum install git 
yum install nginx
ps -ef | grep nginx


./letsencrypt-auto certonly --standalone --email stellayangfan@gmail.com -d itnewhand.com -d www.itnewhand.com
```

## 参考
* [实战申请Let's Encrypt永久免费SSL证书过程教程及常见问题](https://www.laozuo.org/7676.html)
