const { isDirOrMd } = require('./lib/md-links');
const path = require('path');

const init = () => {
  if (process.argv.length > 2) {
    const filePath = process.argv[2].toLowerCase();
    const absolutePath = path.resolve(filePath);
    const options = process.argv;
    let validate = false;
    let showStats = false;

    for (let index = 3; index < options.length; index++) {
      if (options[index].toLowerCase() === '--validate') {
        validate = true;
      } else if (options[index].toLowerCase() === '--stats') {
        showStats = true;
      }
    }
    console.log(options);
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