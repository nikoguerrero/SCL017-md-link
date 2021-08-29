const { meowDownLinks } = require('./lib/meowLib');
const { asciiArt } = require('./bin/asciiArt')
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

    meowDownLinks(absolutePath, options)
      .then((results) => {
        console.log('\n');
        console.log(results);
        console.log(`
                  here are your results
                  meow :3
              ${asciiArt[Math.floor(Math.random() * asciiArt.length)]}
        `);
        console.log('\n');
      }).catch((error) => {
        console.log('wrong file or directory!' + absolutePath);
      });
    // try { // exceptions handling
    //   isDirOrMd(absolutePath, options);
    // } catch (e) {
    //   console.log(e);
    // }
    // mdLinks(absolutePath, options)
    // .then(file => {
    //   console.log(file);
    // }).catch(error => console.log(error));
  }
};

init();

module.exports = {
  init
};