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

export const BUILD_TAB_ENABLED = `${buildTabEnabled}`;