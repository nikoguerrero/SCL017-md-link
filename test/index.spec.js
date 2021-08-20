const { init } = require('../index.js');

describe('init', () => {

  it('should be a function', () => {
    expect(typeof init).toBe('function');
  });
});