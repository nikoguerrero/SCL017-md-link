const { isDirOrMd } = require('./lib/md-links');

const init = () => {
  if (process.argv.length > 2) {
    const filePath = process.argv[2].toLowerCase();
    try { // manejo de excepciones
      isDirOrMd(filePath);
    } catch (e) {
      console.log(e);
    }
  }
};

init();

module.exports = {
  init
};