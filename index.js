const { isDirOrMd } = require('./lib/md-links');
const path = require('path');

const init = () => {
  const userArgs = process.argv;
  if (userArgs.length > 2) {
    const filePath = userArgs[2].toLowerCase();
    const absolutePath = path.resolve(filePath);
    const options = {
      validate: false,
      showStats: false
    };

    for (let index = 3; index < userArgs.length; index++) {
      if (userArgs[index].toLowerCase() === '--validate') {
        options.validate = true;
      } else if (userArgs[index].toLowerCase() === '--stats') {
        options.showStats = true;
      }
    }
    try { // exceptions handling
      isDirOrMd(absolutePath, options);
    } catch (e) {
      console.log(e);
    }
  }
};

init();

module.exports = {
  init
};