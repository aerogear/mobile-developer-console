function addProtocolIfMissing(url) {
  if (url && !url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}

module.exports = {
  addProtocolIfMissing
};
