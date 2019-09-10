function addProtocolIfMissing(url) {
  if (url && !url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}

let counter = 0;

function logAction(msg) {
  // Fuction prints yellow message with the current count after.
  // Usefully for tracking number of calls in the logs
  counter++;
  console.log('\x1b[33m%s\x1b[0m', msg, counter);
}

function getAppName(serviceCr) {
  let raw = serviceCr.object.metadata.name;
  raw = raw.split('-');
  return raw[0];
}

function getApp(appList, appName) {
  try {
    const apps = appList.filter(app => app.metadata.name === appName);
    if (apps.length === 1) {
      return apps[0];
    }
    throw new Error('apps list was not equal to one, bad name match\n', apps);
  } catch (err) {
    console.log(err);
  }
  return null;
}

module.exports = {
  addProtocolIfMissing,
  logAction,
  getAppName,
  getApp
};
