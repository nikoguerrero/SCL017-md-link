// module.exports = () => {
  
// };
const fs = require('fs');
const path = require('path');

const init = () => {
  if (process.argv.length > 2) {
    const filePath = process.argv[2].toLowerCase();
    if (isArgMdFile(filePath)) {
      console.log('cargaste un archivo md');
      readMDContent(filePath);
    } else if (isArgDir(filePath)) {
      console.log('es un directorio');
    } else {
      console.log('no es un archivo válido');
    }
    process.exit(1);
  }
};

const isArgMdFile = (filePath) => {
  const fileExt = path.extname(filePath);
  const mdExt = '.md';
  return fileExt === mdExt;
  // if (fileExt === mdExt) {
  //   console.log('cargaste un archivo md');
  // }
};

const isArgDir = (filePath) => {
  // fs.stat(filePath, (error, stats) => {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //   return stats.isDirectory();
  // });
  const stats = fs.statSync(filePath);
  return stats.isDirectory();
};

const readMDContent = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  console.log(file);
};

init();
