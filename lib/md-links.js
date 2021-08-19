const fs = require('fs');
const path = require('path');

const isArgMdFile = (filePath) => {
  const fileExt = path.extname(filePath.toLowerCase());
  const mdExt = '.md';
  return fileExt === mdExt;
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

const readDir = (filePath) => {
  const pathFolder = filePath;
  asyncReadDir(pathFolder)
    .then((files) => {
      files.forEach(file => {
        const fileFullPath = filePath + '/' + file;
        console.log(fileFullPath);
        if (isArgDir(fileFullPath)) {
          readDir(fileFullPath);
          console.log('yes, recursividad directorio')
        } else if (isArgMdFile(fileFullPath)) {
          readMDContent(fileFullPath);
          console.log(('yes, recursividad archivo md'))
        }
      });
    }).catch((err) => {
      console.log('could not find directory ' + pathFolder);
    });
};

const asyncReadDir = (pathFolder) => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathFolder, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

module.exports = {
  isArgMdFile,
  isArgDir,
  readMDContent,
  readDir
};