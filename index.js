const { isDirOrMd } = require('./lib/md-links');
const path = require('path');

const init = () => {
  if (process.argv.length > 2) {
    const filePath = process.argv[2].toLowerCase();
    const absolutePath = path.resolve(filePath);
    console.log(absolutePath);
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