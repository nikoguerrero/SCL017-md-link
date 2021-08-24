const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const isDirOrMd = (fullPath, options) => {
  if (isArgDir(fullPath)) {
    readDir(fullPath);
    console.log('this is a directory');
  } else if (isArgMdFile(fullPath)) {
    readMDContent(fullPath, options);
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

const readMDContent = (filePath, options) => {
  // const file = fs.readFileSync(filePath, 'utf8');
  // console.log(file);
  asyncReadMDcontent(filePath)
    .then((file) => {
      getMDLinks(file, filePath, options);
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

const getMDLinks = (file, filePath, options) => {
  // const regexp = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  const regexp = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g
  const matches = file.matchAll(regexp);
  let mdLinks = [];
  // let totalLinks = 0;
  for (const match of matches) {
    data = {
      href: match[2],
      text: match[1],
      file: filePath
    };
    mdLinks = data;
    // totalLinks++;
    validateOrStats(options, mdLinks);
  }
};

const validateOrStats = (options, result) => {
  if (options.validate) {
    console.log(options.validate)
    validateLink(result);
  } else if (!options.validate) {
    // console.log(result);
    console.log(options.showStats);
  } else if (options.showStats) {
    linkStats();
  }
};

const validateLink = (result) => {
  if (result.href.includes('https')) {
    https.get(result.href, (res) => {
      const status = res.statusCode;
      // console.log(res.headers);
      if (status === 200) {
        result.status = status;
        result.ok = 'ok';
        console.log(result);
      } else if (status === 404) {
        result.status = status;
        result.ok = 'fail';
        console.log(result);
      } else {
        result.status = res.statusCode;
        result.ok = 'i dont know';
        console.log(result);
      }
    });
  } else {
    http.get(result.href, (res) => {
      const status = res.statusCode;
      if (status === 200) {
        result.status = status;
        result.ok = 'ok';
        console.log(result);
      } else if (status === 404) {
        result.status = status;
        result.ok = 'fail';
        console.log(result);
      } else {
        result.status = res.statusCode;
        result.ok = 'i dont know';
        console.log(result);
      }
    });
  }
};

const linkStats = () => {
  console.log('total and unique links');
};

module.exports = {
  isArgMdFile,
  isArgDir,
  readMDContent,
  readDir,
  isDirOrMd
};