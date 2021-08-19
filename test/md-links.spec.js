const { isArgMdFile } = require('../lib/md-links.js');

describe('isArgMdFile', () => {

  it('should be a function', () => {
    expect(typeof isArgMdFile).toBe('function');
  });

  it('should return a boolean', () => {
    const result = isArgMdFile('text.md');
    console.log(isArgMdFile.toString());
    expect(typeof result === 'boolean').toBeTruthy();
  });
});
