let buildTabEnabled = false;
let docsPrefix = 'https://docs.aerogear.org/aerogear/latest';

if (window && window.SERVER_DATA) {
  const serverConfig = JSON.parse(window.SERVER_DATA);
  buildTabEnabled = serverConfig.ENABLE_BUILD_TAB;
  docsPrefix = serverConfig.DOCS_PREFIX;
}

const defaultState = {
  buildTabEnabled,
  docsPrefix
};

const r = (state = defaultState) =>
  // the config state is immutable
  state;

export default r;
