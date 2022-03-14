const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    if ( 'undefined' !== options.limit && typeof(options.limit) === 'number' ) {
      this.limit = options.limit;
    } else {
      this.limit = 10;
    }
    this.bufferSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bufferSize += chunk.length;
    if ( this.bufferSize <= this.limit ) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
