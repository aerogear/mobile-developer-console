const timeout = timeoutDelay =>
  new Promise(resolve => {
    setTimeout(resolve, timeoutDelay);
  });

module.exports = timeout;
