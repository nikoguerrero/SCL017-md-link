const { meowDownLinks } = require('./lib/meow-down-links');
const { asciiArt } = require('./bin/asciiArt')
const path = require('path');

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
      const basicInfo = `Href: ${element.href}` + '\n' + `Text: ${element.text}` + '\n' + `Line: ${element.line}` +'\n' + `Path: ${element.file}` + '\n';
      const basicStats = `Total: ${element.total}` + '\n' + `Unique: ${element.unique}` + '\n';
      if (!options.validate && !options.showStats) {
        console.log(basicInfo);
      } else if (options.validate && !options.showStats) {
        if ('originalHref' in element) {
          console.log(basicInfo + `Response status: ${element.status} (${element.ok})` + '\n' + `Redirected from: ${element.originalHref}` + '\n');
        } else {
          console.log(basicInfo + `Response status: ${element.status} (${element.ok})` + '\n');
        }
      } else if (!options.validate && options.showStats) {
        console.log(basicStats);
      } else if (options.validate && options.showStats){
        console.log(basicStats + `Broken: ${element.broken}`+ '\n' + `Redirected: ${element.redirected}`);
      } 
    });
    // console.log(results);
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
