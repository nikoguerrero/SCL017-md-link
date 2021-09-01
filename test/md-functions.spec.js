const { isArgMdFile, isArgDir, getMDLinks } = require('../lib/md-functions');
const fs = require('fs');

jest.mock('fs');

describe('isArgMdFile', () => {
  it('should be a function', () => {
    expect(typeof isArgMdFile).toBe('function');
  });

  it('should return true', () => {
    const result = isArgMdFile('text.md');
    expect(result).toBeTruthy();
  });
});

describe('isArgDir', () => {
  it('should be a function', () => {
    expect(typeof isArgDir).toBe('function');
  });

  it('should return true when argument is directory', () => {
    fs.statSync.mockReturnValue({
      isDirectory: () => {
        return true;
      }
    })
  const result = isArgDir('./devfolder/testFolder');
  expect(result).toBeTruthy();
  });

  it('should return false when argument is not a directory', () => {
    fs.statSync.mockReturnValue({
      isDirectory: () => {
        return false;
      }
    });
  const result = isArgDir('testing.md');
  expect(result).toBeFalsy();
  });
});

describe('it should return an array', () => {
  const path = 'testing.md';
  const result = getMDLinks(path);
  expect(result).toBeInstanceOf(Array);
});
