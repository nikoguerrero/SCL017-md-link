const https = require('https');

const href = 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array';

https.get(href, (res) => {
  console.log(res.headers);
  res.on('data', (d) => {
    // process.stdout.write(d);
  });
}).end();