const http = require('http');
const querystring = require('querystring');
const port = '3000';
const crypto = require('crypto');
const secret = 'stella';
const sign = value => crypto.createHmac('sha256', secret).update(value).digest('base64').replace(/\=/g, '').replace(/\+/g, '-').replace(/\\/g, '_');

http.createServer((req, res) => {
    const { url } = req;
    let arr = [];
    req.getCookie = (key, options = {}) => {
        let cookies = req.headers['cookie'];
        cookies = querystring.parse(cookies, '; ');
        let cookie = cookies[key];
        let [value, s] = cookie.includes('.') ? cookie.split('.') : [cookie];
        if (options.signed) {
            if (sign(value) === s) {
                return value;
            } else {
                return ''
            }
        }
        return value;
    }
    res.setCookie = (key, value, options = {}) => {
        let opts = [];
        let cookie = `${key}=${value}`;
        if (options.maxAge) opts.push(`max-age=${options.maxAge}`)
        if (options.domain) opts.push(`domain=${options.domain}`)
        if (options.httpOnly) opts.push(`httpOnly=${options.httpOnly}`)
        if (options.signed) cookie = cookie + '.' + sign(value);
        arr.push(`${cookie}; ${opts.join('; ')}`);
        res.setHeader('Set-Cookie', arr);
    }
    if (url == '/write') {
        res.setCookie('name', 'stella', {
            httpOnly: true,
        });
        res.setCookie('age', '10', {
            // maxAge: 10 * 1000,
            signed: true,
        })
        res.end()
    } else if (url == '/read') {
        res.end(req.getCookie('age') || '空');
    } else {
        res.statusCode = '404';
        res.end('Not Found')
    }
}).listen(port, () => console.log(`Server started at ${port}. Press Ctrl + C to stop.`))