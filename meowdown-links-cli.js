#!/usr/bin/env node

const { meowDownLinks } = require('./lib/meowdown-links');
const { asciiArt } = require('./data/asciiArt')
const path = require('path');

const userArgs = process.argv;
if (userArgs.length > 2) {
  const filePath = userArgs[2].toLowerCase();
  const absolutePath = path.resolve(filePath);
  const options = {
    validate: false,
    showStats: false
  }
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
      const basicStats = `\x1b[32m Total:  ${element.total}\x1b[0m` + '\n' + `\x1b[32m Unique: ${element.unique}\x1b[0m` + '\n';
      const advanceInfo = basicInfo +  `Response status: ${element.status} (${element.ok})` + '\n';
      const advanceStats = basicStats + `\x1b[31m Broken: ${element.broken}\x1b[0m`+ '\n' + `\x1b[36m Redirected: ${element.redirected}\x1b[0m`;
      if (!options.validate && !options.showStats) {
        console.log(basicInfo);
      } else if (options.validate && !options.showStats) {
        if ('originalHref' in element) {
          console.log('\x1b[36m' + advanceInfo  + 'Redirected from: ' + element.originalHref  + '\x1b[0m' + '\n');
        } else if(element.status === 404) {
          console.log('\x1b[31m' + advanceInfo + '\x1b[0m');
        } else {
          console.log('\x1b[32m' + advanceInfo + '\x1b[0m');
        }
      } else if (!options.validate && options.showStats) {
        console.log(basicStats);
      } else if (options.validate && options.showStats) {
        console.log(advanceStats);
      } 
    });
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
