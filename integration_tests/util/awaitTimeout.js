function timeout(timeoutDelay = 5000) {
  return new Promise(resolve => {
    setTimeout(resolve, timeoutDelay);
  });
}

module.exports = timeout;
