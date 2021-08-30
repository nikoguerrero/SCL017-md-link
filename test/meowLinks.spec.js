const { init } = require('../meowLinks.js');

describe('init', () => {

  it('should be a function', () => {
    expect(typeof init).toBe('function');
  });
});