const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const isDirOrMd = (fullPath) => {
  console.log(fullPath);
  if (isArgDir(fullPath)) {
    readDir(fullPath);
    console.log('this is a directory');
  } else if (isArgMdFile(fullPath)) {
    readMDContent(fullPath);
    console.log('this is an md file');
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
  // const file = fs.readFileSync(filePath, 'utf8');
  // console.log(file);
  asyncReadMDcontent(filePath)
    .then((file) => {
      getMDLinks(file, filePath);
    });
};

const asyncReadMDcontent = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getMDLinks = (file, filePath) => {
  // const regexp = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  const regexp = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g
  const matches = file.matchAll(regexp);
  let mdLinks = [];
  for (const match of matches) {
    data = {
      linkText: match[1],
      linkHref: match[2],
      linkPath: filePath
    };
    mdLinks = data;
    console.log(mdLinks.linkHref);
    validateLink(mdLinks.linkHref);
  }
};

const validateLink = (href) => {
  if (href.includes('https')) {
    https.get(href, (res) => {
      const status = res.statusCode;
      if (status === 200) {
        console.log('valid https link');
      }
    });
  } else {
    http.get(href, (res) => {
      const status = res.statusCode;
      if (status === 200) {
        console.log('valid http link');
      }
    });
  }
};

module.exports = {
  isArgMdFile,
  isArgDir,
  readMDContent,
  readDir,
  isDirOrMd
};