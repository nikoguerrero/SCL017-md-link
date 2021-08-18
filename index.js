// module.exports = () => {
  
// };
const fs = require('fs');
const path = require('path');

if (process.argv.length > 2) {
  // console.log('argumento usuario ' + process.argv[2]);
  const filePath = process.argv[2];
  // const file = fs.readFileSync(filePath, 'utf8');
  // console.log(file);
  const fileExt = path.extname(filePath).toLowerCase();
  const mdExt = '.md';
  if (fileExt === mdExt) {
    console.log('cargaste un archivo md');
  } else {
    console.log('no es un archivo mark down');
  }
  process.exit(1);
}

// const isArgMd = (path) => {
//   const fileExt = path.extname(process.argv[2]);
//   const mdExt = '.md';
//   if (fileExt === mdExt) {
//     console.log('cargaste un archivo md');
//   }
// };