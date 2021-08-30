const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const meowDownLinks = (fullPath, options) => {
  return new Promise((resolve, reject) => {
    let totalMdLinks = [];
    isDirOrMd(fullPath, totalMdLinks);
    if (!options.validate && !options.showStats) {
      if (totalMdLinks.length > 0) {
        resolve(totalMdLinks);
      } else {
        reject(new Error('couldn\'t find any link'));
      }
    } else if (options.validate && !options.showStats) {
      validateLink(totalMdLinks)
        .then((results) => {
          resolve(results);
        });
    } else if (!options.validate && options.showStats) {
      resolve(linkStats(totalMdLinks, options));
    } else if (options.validate && options.showStats) {
      validateAndStats(totalMdLinks, options)
        .then((results) => {
          resolve(results);
        });
    }
  });
};

const isDirOrMd = (fullPath, totalMdLinks) => {
  if (isArgDir(fullPath)) {
    syncReadDir(fullPath, totalMdLinks);
  } else if (isArgMdFile(fullPath)) {
    syncReadFile(fullPath, totalMdLinks);
  }
};

// const isDirOrMd = (fullPath, options) => {
//   if (isArgDir(fullPath)) {
//     readDir(fullPath, options);
//     // console.log('this is a directory');
//   } else if (isArgMdFile(fullPath)) {
//     readMDContent(fullPath, options);
//     // console.log('this is an md file');
//   }

// };

const isArgMdFile = (filePath) => {
  const fileExt = path.extname(filePath.toLowerCase());
  const mdExt = '.md';
  return fileExt === mdExt;
};

const isArgDir = (dirPath) => {
  try {
    const stats = fs.statSync(dirPath);
    return stats.isDirectory();
  } catch (e) {
    throw new Error('not a valid directory ' + dirPath); // new Error prints callstack
  }
};

// const readDir = (dirPath, options) => {
//   const pathFolder = dirPath;
//   asyncReadDir(pathFolder)
//     .then((files) => {
//       files.forEach(file => {
//         const fullPath = path.join(pathFolder, file);
//         isDirOrMd(fullPath, options);
//       });
//     }).catch((err) => {
//       console.log('could not find directory ' + pathFolder);
//     });
// };

// const asyncReadDir = (pathFolder) => {
//   return new Promise((resolve, reject) => {
//     fs.readdir(pathFolder, (err, files) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(files);
//       }
//     });
//   });
// };

const syncReadDir = (pathFolder, mdLinks) => {
  files = fs.readdirSync(pathFolder);
  files.forEach(file => {
    const fullPath = path.join(pathFolder, file);
    if (isArgDir(fullPath)) {
      syncReadDir(fullPath, mdLinks);
    } else if (isArgMdFile(fullPath)) {
      syncReadFile(fullPath, mdLinks);
    } 
  });
};

const syncReadFile = (filePath, mdLinks) => {
  const file = fs.readFileSync(filePath, 'utf8');
  mdLinks.push(...getMDLinks(file, filePath));
};

// const readMDContent = (filePath, options) => {
//   asyncReadMDcontent(filePath)
//     .then((file) => {
//       getMDLinks(file, filePath, options);
//     });
// };
// const asyncReadMDcontent = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(getMDLinks(data, filePath));
//       }
//     });
//   });
// };

const getMDLinks = (file, filePath) => {
  const splitLines = file.split('\n');
  let mdLinks = [];
  for (index = 0; splitLines.length > index; ++index) {
    const line = splitLines[index];
    const regexp = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;
    const matches = line.matchAll(regexp);
    const matchFound = regexp.test(line);
    if (matchFound) {
      for (const match of matches) {
        const data = {
          href: match[2],
          text: match[1],
          file: filePath,
          line: index + 1
        };
        if (data.text.length > 50) {
          data.text = data.text.substring(0, 50);
        }
        mdLinks.push(data);
      }
    }
  }
  console.log(mdLinks);
  return mdLinks;
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
      element.ok = 'fail';
      element.status = 404;
      resolve(element);
      //reject(new Error('there was an error ' + e));
    }).end();
  })
};

const linkStats = (mdLinks, options, brokenLinks) => {
  const stats = [];
  const urls = mdLinks.map(element => element.href);
  const totalLinks = urls.length;
  const uniqueLinks = new Set(urls).size;
  const linkStats = { total: totalLinks,  unique: uniqueLinks };
  if (options.validate && options.showStats) {
    if (!brokenLinks) {
      linkStats.broken = 0;
    } else {
      linkStats.broken = brokenLinks;
    }
  }
  stats.push(linkStats);
  return stats;
};

const validateAndStats = (mdLinks, options) => {
  return new Promise((resolve, reject) => {
    validateLink(mdLinks).then(() => {
      const linkStatus = {};
      const urls = mdLinks.map(element => element.status);
      urls.forEach((index) => {
        linkStatus[index] = (linkStatus[index] || 0) + 1;
      });
      const brokenLinks = linkStatus['404'];
      resolve(linkStats(mdLinks, options, brokenLinks));
    });
  });
};

module.exports = {
  meowDownLinks,
  isArgMdFile,
  isArgDir,
  getMDLinks
};