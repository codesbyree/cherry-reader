const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.bahree36.cherryreader.dev";
  }

  if (IS_PREVIEW) {
    return "com.bahree36.cherryreader.preview";
  }

  return "com.bahree36.cherryreader";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Cherry Reader (Dev)";
  }

  if (IS_PREVIEW) {
    return "Cherry Reader (Preview)";
  }

  return "Cherry Readers";
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
