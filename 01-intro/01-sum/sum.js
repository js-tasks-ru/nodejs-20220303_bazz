function sum(a, b) {
  const allowedTypes = ['number', 'bigint'];

  if (
    allowedTypes.indexOf(typeof(a)) !== -1 &&
    allowedTypes.indexOf(typeof(b)) !== -1
  ) {
    return a + b;
  }

  throw new TypeError('-=O_o=-');
}

module.exports = sum;
