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
  for (const match of matches) {
    data = {
      href: match[2],
      text: match[1],
      file: filePath
    };
    mdLinks.push(data);
  }
  validateOrStats(options, mdLinks);
};

const validateOrStats = (options, mdLinks) => {
  if (options.validate) {
    validateLink(mdLinks).then(() => {
      console.log(mdLinks);
    });   
  } else if (options.showStats) {
    linkStats(mdLinks);
  } else if (options.validate && options.validate) {
    console.log('validando link y mostrando stats');
  } else if (!options.validate && !options.showStats) {
    console.log(mdLinks);
  }
};

const validateLink = (mdLinks) => {
  const validatePromises = [];
  for (let index = 0; index < mdLinks.length; index++) {
    const element = mdLinks[index];
    if (element.href.includes('https')) {
      validatePromises.push(validateLinkAsync(https, element));
    } else {
      validatePromises.push(validateLinkAsync(http, element));
    }
  }
  return Promise.all(validatePromises);
};

const validateLinkAsync = (httpModule, element) => {
  return new Promise((resolve, reject) => {
    const options = { timeout: 12000 };
    httpModule.get(element.href, options, (res) => {
      element.status = res.statusCode;
      if (element.status === 200) {
        element.ok = 'ok';
      } else if (element.status === 400) {
        element.ok = 'fail';
      } else {
        element.ok = 'another http status code';
      }
      resolve(element);
    }).on('error', (e) => {
      console.error('there was an error ' + e);
    }).end();
  })
};

const linkStats = (mdLinks) => {
  const urls = mdLinks.map(element => element.href);
  const totalLinks = urls.length;
  console.log(totalLinks);
  const basicStats = { total: totalLinks };
  console.log(basicStats);
};

  // const options = { timeout: 12000 };
  // if (result[0].href.includes('https')) {
  //   https.get(result[0].href, options, (res) => {
  //     const status = res.statusCode;
  //     // console.log(res.headers);
  //     if (status === 200) {
  //       result.status = status;
  //       result.ok = 'ok';
  //       console.log(result);
  //     } else if (status === 404) {
  //       result.status = status;
  //       result.ok = 'fail';
  //       console.log(result);
  //     } else {
  //       result.status = res.statusCode;
  //       result.ok = 'i dont know';
  //       console.log(result);
  //     }
  //     res.on('timeout',  () => {
  //       console.log('timeout ' + result.href);
  //     });
  //   }).on('error', (e) => {
  //     console.error('there was an error ' + e);
  //   }).end();

module.exports = {
  isArgMdFile,
  isArgDir,
  readMDContent,
  readDir,
  isDirOrMd
};