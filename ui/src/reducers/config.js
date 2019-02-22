let buildTabEnabled = false;
let docsVersion = 'latest';

if (window && window.SERVER_DATA) {
  const serverConfig = JSON.parse(window.SERVER_DATA);
  buildTabEnabled = serverConfig.ENABLE_BUILD_TAB;
  docsVersion = serverConfig.AEROGEAR_DOCS_VERSION;
}

const defaultState = {
  buildTabEnabled,
  docsVersion
};

const r = (state = defaultState) =>
  // the config state is immutable
  state;

export default r;
