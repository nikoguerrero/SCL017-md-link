const fs = require('fs');
const path = require('path');

const isDirOrMd = (fullPath) => {
  console.log(fullPath);
  if (isArgDir(fullPath)) {
    readDir(fullPath);
    console.log('this is a directory');
  } else if (isArgMdFile(fullPath)) {
    readMDContent(fullPath);
    console.log('this is a md file');
  }
};

const isArgMdFile = (filePath) => {
  const fileExt = path.extname(filePath.toLowerCase());
  const mdExt = '.md';
  return fileExt === mdExt;
};

const isArgDir = (dirPath) => {
  // fs.stat(filePath, (error, stats) => {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //   return stats.isDirectory();
  // });
  try {
    const stats = fs.statSync(dirPath);
    return stats.isDirectory();
  } catch (e) {
    throw new Error('not a valid directory ' + dirPath); // new Error prints callstack
  }
};

const readDir = (dirPath) => {
  const pathFolder = dirPath;
  asyncReadDir(pathFolder)
    .then((files) => {
      files.forEach(file => {
        const fullPath = path.join(pathFolder, file);
        isDirOrMd(fullPath);
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

const readMDContent = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8');
  console.log(file);
};

module.exports = {
  isArgMdFile,
  isArgDir,
  readMDContent,
  readDir,
  isDirOrMd
};