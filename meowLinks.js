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
        results.forEach(element => {
          if (!options.validate && !options.showStats) {
            console.log(element.href, element.text, element.file, element.line);
          } else if (options.validate && !options.showStats) {
            console.log(element.href, element.text, element.file, element.line, element.status, element.ok)
          } else if (!options.validate && options.showStats) {
            console.log(`Total: ${element.total}`, `Unique: ${element.unique}`);
          } else if (options.validate && options.showStats){
            console.log(`Total: ${element.total}`, `Unique: ${element.unique}`, `Broken: ${element.broken}`);
          } 
        });
        console.log(results);
        console.log(`
                  here are your results
                  meow :3
              ${asciiArt[Math.floor(Math.random() * asciiArt.length)]}
        `);
        console.log('\n');
      }).catch((error) => {
        console.log(error.message);
      });
  }
};

init();

module.exports = {
  init
};