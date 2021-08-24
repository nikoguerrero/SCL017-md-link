const https = require('https');

const href = process.argv[2];

https.get(href, (res) => {
  const status = res.statusCode;
  console.log(res.headers);
  return status;
  // console.log('headers', res.headers);
  // console.log(res);
  // res.on('data', (d) => {
  //   process.stdout.write(d);
  // });
}).end();
