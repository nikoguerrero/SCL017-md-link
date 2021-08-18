const fs = require('fs');
const filePath = '/dev/SCL017-md-link/devfolder/test.txt';
const file = fs.readFileSync(filePath, 'utf8');
console.log(file);


const path = require('path');
const ext = path.extname('/dev/SCL017-md-link/devfolder/test.txt');
console.log(ext);

const devFolder = '/dev/SCL017-md-link/devfolder/';
// fs.readdir(devFolder, (err, files) => {
//   if (err) {
//     return console.log('no se pudo escanear el directorio: ' + err);
//   }
//   files.forEach(file => {
//     console.log(file);
//   });
// });

const dirPath = path.join(devFolder, 'testFolder');
console.log(dirPath);

fs.readdir(dirPath, (err, files) => {
  if (err) {
    return console.log('no se pudo escanear el directorio: ' + err);
  }
  files.forEach(file => {
    console.log(file);
  });
});

// const {readFile} = require('fs');
// const fileRead = (path) => {
//   readFile(path, (error, fileBuffer) => {
//     if (error) {
//       console.error(error.message);
//       process.exit(1);
//     }
//     const fileContent = fileBuffer.toString();
//     console.log(fileContent);
//   });
// };

// fileRead('index.js', () => {
//   fileRead('exercises.js');
// });

// const {promises: {readFile}} = require('fs');
// // readFile('index.js').then(fileBuffer => {
// //   console.log(fileBuffer.toString());
// // }).catch(error => {
// //   console.error(error.message);
// //   process.exit(1);
// // });
// Promise.all([
//   readFile('index.js'),
//   readFile('exercises.js')
// ]).then(([index, exercises]) => {
//   console.log(index.toString());
//   console.log(exercises.toString());
// }).catch(error => {
//   console.error(error.message);
//   process.exit(1);
// });
