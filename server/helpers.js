function addProtocolIfMissing(url, protocol='https') {
  if (url && !url.startsWith(protocol)) {
    return `${protocol}://${url}`;
  }
  return url;
}

module.exports = {
  addProtocolIfMissing
};
