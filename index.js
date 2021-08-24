const { isDirOrMd } = require('./lib/md-links');
const path = require('path');

const init = () => {
  if (process.argv.length > 2) {
    const userArgs = process.argv;
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
    console.log(userArgs);
    try { // exceptions handling
      isDirOrMd(absolutePath);
    } catch (e) {
      console.log(e);
    }
  }
};

init();

module.exports = {
  init
};