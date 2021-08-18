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
    } else {
      console.log('no es un archivo mark down');
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

const readMDContent = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  console.log(file);
};

init();
