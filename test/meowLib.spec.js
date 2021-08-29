const { isArgMdFile, isArgDir, getMDLinks } = require('../lib/meowLib.js');

describe('isArgMdFile', () => {
  it('should be a function', () => {
    expect(typeof isArgMdFile).toBe('function');
  });

  it('should return a boolean', () => {
    const result = isArgMdFile('text.md');
    expect(typeof result === 'boolean').toBeTruthy();
  });
});

describe('isArgDir', () => {
  it('should be a function', () => {
    expect(typeof isArgDir).toBe('function');
  });

  it('should return a boolean', () => {
  const result = isArgDir('./devfolder/testFolder');
  expect(typeof result === 'boolean').toBeTruthy();
  });
});

describe('it should return an array', () => {
  const path = 'testing.md';
  const result = getMDLinks(path);
  expect(result).toBeInstanceOf(Array);
});

