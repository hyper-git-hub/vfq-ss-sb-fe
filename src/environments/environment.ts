// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Dev URLs,
  // baseUrlUser: 'https://dev.gateway.iot.vodafone.com.qa',
  // baseUrlSS: 'https://dev.gateway.iot.vodafone.com.qa/smartsurveillance',
  // baseUrlSB: 'https://dev.gateway.iot.vodafone.com.qa/smartbuilding',
  // baseUrlRA: 'https://dev.gateway.iot.vodafone.com.qa/roleaccess',
  // baseUrlStreaming: 'https://dev.gateway.iot.vodafone.com.qa/ss-camera',
  // baseUrlDevice: 'https://dev.gateway.iot.vodafone.com.qa/device-manager',
  // baseUrlAudit: 'https://dev.gateway.iot.vodafone.com.qa/audit',
  // baseUrlNotif: 'https://dev.gateway.iot.vodafone.com.qa/notification',
  // baseUrlDashboard: 'https://dev.gateway.iot.vodafone.com.qa/report-analytics/api',
  // baseUrlLiveStream: 'https://devgatewayhn.hypernymbiz.com/live-stream',
  // websocketUrl: 'wss://devgatewayhn.hypernymbiz.com/ws-live-stream',
  // // baseUrlLiveStream: 'https://dev.gateway.iot.vodafone.com.qa/live-stream',
  // signalR: 'https://func-vfq-dev.azurewebsites.net',

  // New Dev URLs,
  // baseUrlUser: 'https://devgatewayhn.hypernymbiz.com/user-ms',
  // baseUrlSS: 'https://devgatewayhn.hypernymbiz.com/camera-service',
  // baseUrlSB: 'https://devgatewayhn.hypernymbiz.com/smart-building',
  // baseUrlRA: 'https://devgatewayhn.hypernymbiz.com/platform-role-access',
  // baseUrlStreaming: 'https://devgatewayhn.hypernymbiz.com/camera-service',
  // baseUrlDevice: 'https://devgatewayhn.hypernymbiz.com/device-manager',
  // baseUrlAudit: 'https://devgatewayhn.hypernymbiz.com/platform-audit',
  // baseUrlNotif: 'https://devgatewayhn.hypernymbiz.com/notification-alerts',
  // baseUrlDashboard: 'https://devgatewayhn.hypernymbiz.com/report-analytics/api',
  // baseUrlLiveStream: 'https://devgatewayhn.hypernymbiz.com/live-stream',
  // websocketUrl: 'wss://devgatewayhn.hypernymbiz.com/ws-live-stream',
  // // baseUrlLiveStream: 'https://dev.gateway.iot.vodafone.com.qa/live-stream',
  // signalR: 'https://func-vfq-dev.azurewebsites.net',

  // // New Staging URLs,
  baseUrlUser: 'https://at.admin.staging.iot.vodafone.com.qa',
  baseUrlSS: 'https://staging.gateway.iot.vodafone.com.qa/smartsurveillance',    // Staging SSgit add
  baseUrlSB: 'https://staging.gateway.iot.vodafone.com.qa/smart-building',
  baseUrlRA: 'https://staging.gateway.iot.vodafone.com.qa/role-access',
  baseUrlStreaming: 'https://staging.gateway.iot.vodafone.com.qa/camera-service',
  baseUrlDevice: 'https://staging.gateway.iot.vodafone.com.qa/device-manager',
  baseUrlAudit: 'https://staging.gateway.iot.vodafone.com.qa/platform-audit',
  baseUrlNotif: 'https://staging.gateway.iot.vodafone.com.qa/alert-notification',
  baseUrlDashboard: 'https://staging.gateway.iot.vodafone.com.qa/report-analytics/api',
  baseUrlLiveStream: 'https://staging.gateway.iot.vodafone.com.qa/sb-node-live-stream',
  websocketUrl: 'wss://staging.gateway.iot.vodafone.com.qa/sb-node-live-stream',
  // baseUrlStreaming: 'https://staging.gateway.iot.vodafone.com.qa/sscamera', // Staging SS Streaming
  signalR: 'https://func-stag-all.azurewebsites.net',
  cobInventory: 'https://staging.gateway.iot.vodafone.com.qa/cob3inventory',

  translateUrl: '/assets/i18n/',
};

let prefix = ':';

export const ports = {
  userMS: ``,
  monolith: ``,
  smartBuilding: ``,
  monolithCOB: `${prefix}9090`,
};

export const apiIdentifier = {
  userMS: `@user-apis`,
  monolith: `@asset-apis`,
  smartBuilding: `@sb-apis`,
};

export const firebaseConfig = {
  apiKey: "AIzaSyA00zmBCCxGoSRgHViUPxNE--ZE_ZW93MQ",
  authDomain: "vfq-platform-newpackage.firebaseapp.com",
  databaseURL: "https://vfq-platform-newpackage-default-rtdb.firebaseio.com",
  projectId: "vfq-platform-newpackage",
  storageBucket: "vfq-platform-newpackage.appspot.com",
  messagingSenderId: "378670127530",
  appId: "1:378670127530:web:e0b5b21b6b4205ad6e73d3",
  measurementId: "G-N31WE1Y2T9"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
