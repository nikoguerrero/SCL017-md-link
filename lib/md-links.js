const fs = require('fs');
const path = require('path');

const isArgMdFile = (filePath) => {
  const fileExt = path.extname(filePath);
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
        console.log(file);
      });
    }).catch((err) => {
      console.log('could not find directory ' + err);
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