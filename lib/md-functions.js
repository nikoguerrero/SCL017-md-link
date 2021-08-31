const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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

    /* I'm using a negative lookbehind assertion: this means that it only matches 
    if the current location is not preceded by the assertion, but has no other effect.
    This way I get matches for links only, avoiding md images.
    The expression itself is (?<!) You can find more about it in 
    https://exploringjs.com/es2018-es2019/ch_regexp-lookbehind-assertions.html#negative-lookbehind-assertions
    */
    const regexp = /(?<!\!)\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;
    const matches = line.matchAll(regexp);
    const matchFound = regexp.test(line);
    if (matchFound) {
      for (const match of matches) {
        const data = {
          href: match[2],
          text: match[1],
          line: index + 1,
          file: filePath
        };
        if (data.text.length > 50) {
          data.text = data.text.substring(0, 50);
        }
        mdLinks.push(data);
      }
    }
  }
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
    const req = httpModule.get(element.href, options, (res) => {
      element.status = res.statusCode;
      if (element.status === 200) {
        element.ok = 'ok';
      } else if (element.status === 404) {
        element.ok = 'fail';
      } else if (element.status >= 300 && element.status < 309) {
        element.originalHref = element.href;
        if (!res.headers.location.startsWith('/')) {
          element.href = res.headers.location;
        } else if (res.headers.location.startsWith('/')) {
          const redirectedURL = req.agent.protocol + '//' + req.socket.servername + res.headers.location;
          element.href = redirectedURL;
        }
        validateLinkAsync(httpModule, element).then((element) => {
          resolve(element);
        });
        return;
      }
      resolve(element);
    }).on('timeout', ()  => {
      element.status = 408;
      element.ok = 'TIMEOUT';
      if (element.status === 408) {
        validateLinkAsync(httpModule, element).then((element) => {
          resolve(element);
        });
        return;
      }
      // resolve(element);
    }).on('error', (e) => {
      element.ok = 'fail';
      element.status = 404;
      resolve(element);
    }).end();
  });
};

const linkStats = (mdLinks, options, brokenLinks, redirectedLinks) => {
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
    if (!redirectedLinks) {
      linkStats.redirected = 0;
    } else {
      linkStats.redirected = redirectedLinks;
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
      const originalHref = mdLinks.filter(element => element.originalHref).map(element => element.originalHref);
      const redirectedURL = originalHref.length;
      urls.forEach((index) => {
        linkStatus[index] = (linkStatus[index] || 0) + 1;
      });
      const brokenLinks = linkStatus['404'];
      resolve(linkStats(mdLinks, options, brokenLinks, redirectedURL));
    });
  });
};

module.exports = {
  isDirOrMd,
  isArgMdFile,
  isArgDir,
  getMDLinks,
  validateLink,
  linkStats,
  validateAndStats
};