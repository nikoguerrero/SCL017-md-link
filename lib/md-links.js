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
  if (options.validate && !options.showStats) {
    validateLink(mdLinks).then(() => {
      console.log(mdLinks);
    });   
  } else if (options.showStats && !options.validate) {
    linkStats(mdLinks, options);
  } else if (options.validate && options.showStats) {
    console.log('validando link y mostrando stats');
    validateAndStats(mdLinks, options);
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
      } else if (element.status === 404) {
        element.ok = 'fail';
      } else {
        element.ok = 'another http status code';
      }
      resolve(element);
    }).on('timeout', ()  => {
      element.status = 408;
      element.ok = 'TIMEOUT';
      resolve(element);
    }).on('error', (e) => {
      reject(new Error('there was an error ' + e));
    }).end();
  })
};

const linkStats = (mdLinks, options, brokenLinks) => {
  const urls = mdLinks.map(element => element.href);
  const totalLinks = urls.length;
  const uniqueLinks = new Set(urls).size;
  const basicStats = { total: totalLinks,  unique: uniqueLinks };
  if (options.validate && options.showStats) {
    basicStats.broken = brokenLinks;
  }
  console.log(basicStats);
};

const validateAndStats = (mdLinks, options) => {
  validateLink(mdLinks).then(() => {
    const linkStatus = {};
    const urls = mdLinks.map(element => element.status);
    urls.forEach((index) => {
      linkStatus[index] = (linkStatus[index] || 0) + 1;
    });
    const brokenLinks = linkStatus['404'];
    console.log(brokenLinks);
    linkStats(mdLinks, options, brokenLinks);
    console.log(mdLinks);
  });
  // console.log(mdLinks);
};

module.exports = {
  isArgMdFile,
  isArgDir,
  readMDContent,
  readDir,
  isDirOrMd
};