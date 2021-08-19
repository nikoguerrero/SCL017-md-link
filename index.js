const { isArgMdFile, isArgDir, readMDContent, findFiles } = require('./lib/md-links')

const init = () => {
  if (process.argv.length > 2) {
    const filePath = process.argv[2].toLowerCase();
    if (isArgMdFile(filePath)) {
      console.log('cargaste un archivo md');
      readMDContent(filePath);
    } else if (isArgDir(filePath)) {
      console.log('es un directorio');
      findFiles(filePath)
    } else {
      console.log('no es un archivo válido');
    }
    process.exit(1);
  }
};

init();

