/**
 * Application configuration — Braze SDK credentials and app metadata.
 * Replace placeholder values with real credentials before deploying.
 * @module AppConfig
 */
const AppConfig = {
  braze: {
    apiKey: '5289a0ce-f873-450c-a1df-1a412ea78a44',
    baseUrl: 'sdk.iad-03.braze.com',
    sdkUrl: 'https://js.appboycdn.com/web-sdk/6.5/braze.min.js',
  },
  app: {
    version: '2.0.0',
    platform: 'web_mobile_frame',
    name: 'Pan Pacific',
  }
};

export default AppConfig;
