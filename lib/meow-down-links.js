const { isDirOrMd, validateLink, linkStats, validateAndStats } = require('./md-functions');

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

module.exports = {
  meowDownLinks
};
