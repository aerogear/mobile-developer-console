let buildTabEnabled = false;
let docsVersion = 'latest';

if (window && window.SERVER_DATA) {
  try {
    const serverConfig = JSON.parse(window.SERVER_DATA);
    buildTabEnabled = serverConfig.ENABLE_BUILD_TAB;
    docsVersion = serverConfig.AEROGEAR_DOCS_VERSION;
  } catch (e) {
    console.error('failed to parse the server config data', e);
  }
} else {
  console.warn('no server data available');
}

const defaultState = {
  buildTabEnabled,
  docsVersion
};

const r = (state = defaultState) =>
  // the config state is immutable
  state;

export default r;
