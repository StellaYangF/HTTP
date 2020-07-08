const querystring = require('querystring');
const url = require('url');

let result = querystring.parse('name=stella&age=18', '&');
// result = url.parse('http://stella:123@localhost:8080/list?index=1#title', true);
console.log(result);
