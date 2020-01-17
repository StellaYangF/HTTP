# ONE
## 一.主题：

1) 掌握HTTP中必备的概念

2) 掌握node中的http服务的创建及应用

 - url模块的使用

 - 客户端和服务端的创建

 - http静态服务封装

   

## 二.内容：

### 1）什么是HTTP?应用层

通常的网络是在TCP/IP协议族的基础上来运作的，HTTP是一个子集。

### 2）TCP/IP协议族 (HTTP应用层协议 在传输层的基础上增加了一些自己的内容)

协议简单来说就是通信的规则，例如：通信时谁先发起请求，怎样结束，如何进行通信。把互联网相关的协议统称起来称为TCP/IP

### 3）协议分层(OSI协议分层)

(物，数)，网，传，(会，表，应)

- 应用层 HTTP,FTP,DNS (与其他计算机进行通讯的一个应用服务，向用户提供应用服务时的通信活动)

- 传输层 TCP（可靠） UDP 数据传输 (HTTP -> TCP  DNS->UDP)

- 网络层 IP 选择传输路线 (通过ip地址和mac地址)(使用ARP协议凭借mac地址进行通信)

- 链路层 网络连接的硬件部分 

![](http://img.zhufengpeixun.cn/tpchttp.png)

### 4) HTTP特点

- http是不保存状态的协议，使用cookie来管理状态 (登录 先给你cookie 我可以看一下你有没有cookie)
- 为了防止每次请求都会造成无谓的tcp链接建立和断开，所以采用保持链接的方式  keep-alive
- 以前发送请求后需要等待并收到响应，才能发下一个，现在都是管线化的方式 (js css 可以并发请求 6 2) cdn

### 5) HTTP缺点

通信采用明文

不验证通信方的身份

无法验证内容的完整性 (内容可能被篡改) 

> 通过SSL（Secure Sockets Layer - 安全套阶层）建立安全通信线路 HTTPS (超文本传输安全协议)

### 6) HTTP方法 (get post  简单请求) Restful风格

- GET:获取资源   /user？
- POST:传输实体主体 请求体中

- PUT：来传输文件

- HEAD: 获取报文首

- DELETE: 删除文件

- OPTIONS:询问支持的方法   跨域 如果默认发送的是get/post 不会发送options的 ""复杂请求""

  get /post (a:1) headers:{a:1}   put / delete 复杂的请求 

**REST API** Resful风格 根据路径和不同的方法 就能确定对资源进行什么操作  

跨域是浏览器之前的 服务器之间没有跨域问题 反向代理 、后端设置cors

c.com-> d.com  OPTIONS 非简单请求会发送options (options 直接返回ok就可以了)

### 7) HTTP状态码 (发请求 命令行 curl命令) 服务端

curl命令行工具  postman

1xx 信息性状态码  websocket upgrade

2xx 成功状态码  200 204(没有响应体) 206(范围请求 暂停继续下载) 获取网页的部分请求

3xx 重定向状态码 301 302 303 post -> get  304(删除报文主体 在次发送请求) 307 (不会从POST转为GET)

4xx 客户端错误状态码 400 401 403 404  405 方法不允许

5xx 服务端错误状态码 500 503

### 8) http客户端和服务端通信

Http报文，http交互的信息称之为http报文

![](http://img.zhufengpeixun.cn/requestheader.png)

![](http://img.zhufengpeixun.cn/responseheader.png)

通用首部字段：请求和响应报文都有的首部

实体首部字段：描述实体部分的字段

![](http://img.zhufengpeixun.cn/request.png)

![](http://img.zhufengpeixun.cn/response.png)

### 9) URI和URL

### URI

URI(Uniform Resource Identifier)是统一资源标识符,在某个规则下能把这个资源独一无二标示出来，比如人的身份证号

- Uniform 不用根据上下文来识别资源指定的访问方式
- Resource 可以标识的任何东西
- Identifier 表示可标识的对象

### URL

统一资源定位符，表示资源的地点，URL时使用浏览器访问WEB页面时需要输入的网页地址

- Uniform 不用根据上下文来识别资源指定的访问方式
- Resource 可以标识的任何东西
- Location 定位

![](http://img.zhufengpeixun.cn/urlformat.png)

### 10) 报文应用 

Content-Encoding : gzip压缩                  form-data: 多部分对象集合  上传文件

range: 范围请求    206                             accept-language：内容协商   前端控制  后端控制

host：单主机多域名                                 304 http缓存

referer:访问来源      防盗链                     proxy:代理、网关和隧道

user-agent:用户内核                                安全相关的头: X-Frame-Options、X-XSS-Protection (安全 csrf xss https 加密)

**掌握http应用(二)**

1) HTTP中静态服务的编写

2) ajax的使用和跨域问题

3) http缓存(强制缓存和对比缓存)

4) 压缩问题 zlib 转化流

5) 多语言切换

# TWO

## 一.主题：

**掌握http应用(二)**

1) HTTP中静态服务的编写

2) ajax的使用和跨域问题

3) http缓存(强制缓存和对比缓存)

4) 压缩问题 zlib 转化流

5) 多语言切换

## 二.内容

### 1.实现静态服务

- mime模块处理请求文件类型

```
npm install mime -g
```

```javascript
let server = http.createServer((req,res)=>{
    let {pathname} = url.parse(req.url);
    // 根据请求路径查找文件 
    let absFilePath = path.join(__dirname,pathname);
    fs.stat(absFilePath,(err,stat)=>{
        if(err){
            return res.end(`Not Found`);
        }
        if(stat.isDirectory()){ 
            // 尝试查找index.html
            absFilePath = path.join(absFilePath,'index.html');
            fs.access(absFilePath,(err=>{
                if(err){
                    res.end(`Not Found`);
                }else{
                    let type = mime.getType(absFilePath);   
                    res.setHeader('Content-Type',type+';charset=utf-8');
                    fs.createReadStream(absFilePath).pipe(res);
                }
            }));
        }else{  
            let type = mime.getType(absFilePath);   
            res.setHeader('Content-Type',type+';charset=utf-8');
            fs.createReadStream(absFilePath).pipe(res);
        }
    });
});
server.listen(3000);
```



### 2.通过类改写静态服务

通过async和await改写主体流程

```javascript
let http = require('http');
let fs = require('fs').promises;
let {createReadStream} = require('fs');
let url = require('url');
let path = require('path');
let mime = require('mime');
class Server{
    async handleServer(req,res){
        let {pathname} = url.parse(req.url);
        let absFilePath = path.join(__dirname,pathname);
        try{
            let statObj = await fs.stat(absFilePath);
            if(statObj.isDirectory()){
                absFilePath = path.join(absFilePath,'index.html');
            }
            this.sendFile(req,res,absFilePath,statObj);
        }catch(err){
            console.log(err);
            this.sendError(req,res);            
        }
    }
    sendFile(req,res,absFilePath,statObj){
        let type = mime.getType(absFilePath);   
        res.setHeader('Content-Type',type+';charset=utf-8');
        createReadStream(absFilePath).pipe(res);
    }
    sendError(req,res){
        res.statusCode = 404;
        res.end(`Not Found`);
    }
    start(){
        let server = http.createServer(this.handleServer.bind(this));
        server.listen(...arguments);
    }
}
let server = new Server();
server.start(3000);
```



### 3.ajax跨域问题

cors解决跨域问题

```javascript
'Access-Control-Allow-Origin','http://a.zf.cn:5000' // 允许某个域访问
'Access-Control-Allow-Credentials','true'           // 允许携带cookie
'Access-Control-Allow-Headers','a'                  // 允许携带的header
'Access-Control-Max-Age','3600'                     // 设置options的请求发送时长
```



```javascript
let xhr = new XMLHttpRequest();
xhr.open('GET','http://localhost:5000/user',true);
xhr.setRequestHeader('a','1'); // 设置请求头

xhr.onload = function(){ 
	console.log(xhr.responseText); 
}
xhr.withCredentials = true; // 设置强制携带cookie
xhr.send();
```



跨域配置

```javascript
res.setHeader('Access-Control-Allow-Origin','http://a.zf.cn:5000');
res.setHeader('Access-Control-Allow-Credentials','true')
res.setHeader('Access-Control-Max-Age',3600);
res.setHeader('Access-Control-Allow-Headers','a');
if(req.method === 'OPTIONS'){ // options请求直接结束即可
	return res.end()
}
```



### 4.http缓存问题

- 强制缓存 (Cache-Control && Expires)

  Cache-Control:

  - private 客户端可以缓存
  - public 客户端和代理服务器都可以缓存
  - max-age=60 缓存内容将在60秒后失效
  - no-cache 需要使用对比缓存验证数据,强制向源服务器再次验证  (没有强制缓存)
  - no-store 所有内容都不会缓存，强制缓存和对比缓存都不会触发 (不缓存)

![img](http://img.zhufengpeixun.cn/cache2.png)

- 对比缓存 

  ​	Last-Modified & If-Modified-Since

  ​    ETag & *If-None-Match*

![img](http://img.zhufengpeixun.cn/cache4.png)

### 5.压缩与解压缩处理(accept-encoding)

使用GZIP / DEFLATE 实现解压

```javascript
var zlib = require('zlib');
var fs = require('fs');
var http = require('http');
http.createServer(function (request, response) {
    var raw = fs.createReadStream('.' + request.url);
    var acceptEncoding = request.headers['accept-encoding'];
    if (!acceptEncoding) {
        acceptEncoding = '';
    }
    if (acceptEncoding.match(/\bdeflate\b/)) {
        response.setHeader('Content-Encoding','deflate');
        raw.pipe(zlib.createDeflate()).pipe(response);
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        response.setHeader('Content-Encoding','gzip');
        raw.pipe(zlib.createGzip()).pipe(response);
    } else {
        raw.pipe(response);
    }
}).listen(9090)
```

### 6.多语言 (accept-language)

```javascript
let http = require('http');
let pack = {
    en: {
        title: 'hello'
    },
    cn: {
        title: '欢迎'
    }
}

function request(req, res) {
    let acceptLangulage = req.headers['accept-language'];
    let lan = 'en';
    if (acceptLangulage) {
        lan = acceptLangulage.split(',').map(item => {
            let values = item.split(';');
            return {
                name: values[0].split('-')[0],
                q: isNaN(values[1]) ? 1 : parseInt(values[1])
            }
        }).sort((lan1, lan2) => lan1.q - lan2.q).shift().name;
    }
    res.end(pack[lan] ? pack[lan].title : pack['en'].title);

}
let server = http.createServer();
server.on('request', request);
server.listen(8080);
```
