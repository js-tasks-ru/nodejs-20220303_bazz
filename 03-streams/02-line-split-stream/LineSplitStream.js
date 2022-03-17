const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let chunkString = chunk.toString();
    if ( this._lastElement ) {
      chunkString = this._lastElement + chunkString;
    }
    const data = chunkString.split(os.EOL);
    this._lastElement = data.splice(data.length - 1, 1)[0];
    for ( let i = 0; i <= data.length; i++ ) {
      this.push(data[i]);
    }
    callback();
  }

  _flush(callback) {
    if ( this._lastElement ) {
      this.push(this._lastElement);
    }
    this._lastElement = null;
    callback();
  }
}

module.exports = LineSplitStream;
