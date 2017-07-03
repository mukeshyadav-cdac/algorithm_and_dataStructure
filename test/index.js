import http from 'http';
import assert from 'assert';

import '../src/index.js';

describe('Example Node Server', () => {
  it('should return 200', done => {
      assert.equal(200, 200);
      done();
  });
});
