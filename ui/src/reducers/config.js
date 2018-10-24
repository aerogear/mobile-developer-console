let buildTabEnabled = false;

if (window && window.SERVER_DATA) {
  try {
    const serverConfig = JSON.parse(window.SERVER_DATA);
    buildTabEnabled = serverConfig.ENABLE_BUILD_TAB;
  } catch (e) {
    console.error("failed to parse the server config data", e);
  }
} else {
  console.warn("no server data available");
}

const defaultState = {
  buildTabEnabled: buildTabEnabled
};

const r = (state = defaultState) => {
  //the config state is immutable
  return state;
}

export default r;