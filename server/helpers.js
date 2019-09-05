function addProtocolIfMissing(url) {
  if (url && !url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}

let counter = 0;

function logAction(msg) {
  counter++;
  console.log('\x1b[33m%s\x1b[0m', msg, counter);
}

module.exports = {
  addProtocolIfMissing,
  logAction
};
