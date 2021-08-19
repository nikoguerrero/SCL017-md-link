const { isArgMdFile, isArgDir, readMDContent, readDir } = require('./lib/md-links')

const init = () => {
  if (process.argv.length > 2) {
    const filePath = process.argv[2].toLowerCase();
    if (isArgMdFile(filePath)) {
      console.log('this is an md file');
      readMDContent(filePath);
    } else if (isArgDir(filePath)) {
      console.log('this is a directory');
      readDir(filePath);
    } else {
      console.log('not a valid file or folder');
    }
  }
};

init();
