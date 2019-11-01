function addProtocolIfMissing(url, protocol = 'https') {
  if (/^(?:[a-z]+:)?\/\//i.test(url)) {
    return url;
  }
  return `${protocol}://${url}`;
}

module.exports = {
  addProtocolIfMissing
};
