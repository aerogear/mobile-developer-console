const framework = docsVersion => {
  const ret = {
    icon: '/img/ionic.svg',
    title: 'Ionic',
    steps: [
      {
        introduction: 'Create the `mobile-services.json` file.',
        commands: [
          'Create a file called `mobile-services.json` in the `src` directory of your Ionic project',
          'Copy the contents from the panel on the right and paste them into this new file'
        ]
      },
      {
        introduction:
          'Install the Core AeroGear module, the module manages and binds all services together on the client side.',
        commands: [
          'Open a terminal and navigate to your appplication project root folder.',
          ['Install AeroGear Core package, from the terminal, execute:', '```npm install @aerogear/app```']
        ]
      },
      {
        introduction: 'Initialize AeroGear Core module',
        commands: [
          [
            'To init, add the following code in the `src/app/main.ts` file of your project',
            `\`\`\`js 
          import { init } from "@aerogear/app";
          declare var require: any;
          // tslint:disable-next-line:no-var-requires
          const appConfig = require("../mobile-services.json");
          init(appConfig);`
          ]
        ]
      }
    ],
    services: {
      keycloak: {
        serviceLogoUrl: '/img/keycloak.png',
        serviceName: 'Identity Management',
        serviceDescription: 'Identity Management - Identity and Access Management',
        setupText: 'Identity Management SDK setup',
        docsLink: `https://docs.aerogear.org/aerogear/${docsVersion}/identity-management.html#setup`,
        steps: [
          {
            introduction:
              'Execute following commands in your project directory to install all necessary NPM packages needed for the Identity Management service:',
            commands: [['Install the AeroGear Auth package from NPM', '```npm install @aerogear/auth```']]
          }
        ]
      },
      push: {
        serviceLogoUrl: '/img/push.png',
        serviceName: 'Push Notifications',
        serviceDescription: 'Installs a metrics service based on Prometheus and Grafana',
        setupText: 'Push SDK setup',
        docsLink: `https://docs.aerogear.org/aerogear/${docsVersion}/push-notifications.html#setup`,
        steps: [
          {
            introduction:
              'Execute following commands in your project directory to install all necessary NPM packages needed for the Push Notifications service:',
            commands: [
              ['Install Cordova plugin for push', '```cordova plugin add @aerogear/cordova-plugin-aerogear-push```'],
              [
                'Ionic Apps require an additional dependency, the [Ionic Native Push Library](https://ionicframework.com/docs/native/push/)',
                '```npm install --save @ionic-native/push```'
              ],
              [
                'Install Unified Push Server package needed for Device registration',
                '```npm install --save @aerogear/push```'
              ]
            ]
          }
        ]
      },
      metrics: {
        serviceLogoUrl: '/img/metrics.png',
        serviceName: 'Mobile Metrics',
        serviceDescription: 'Installs a metrics service based on Prometheus and Grafana',
        setupText: 'Mobile Metrics SDK setup',
        docsLink: `https://docs.aerogear.org/aerogear/${docsVersion}/mobile-metrics.html#setup`,
        steps: [
          {
            introduction:
              "Metrics is included in all SDK modules, if you already use a component from the AeroGear SDK in your app. You'll need only to install this Cordova plugin to enable it:",
            commands: [
              ['Install Metrics Cordova plugin', '```cordova plugin add @aerogear/cordova-plugin-aerogear-metrics```']
            ]
          }
        ]
      },
      sync: {
        serviceLogoUrl: '/img/sync.svg',
        serviceName: 'Sync',
        serviceDescription: 'Installs Sync service based on Voyager Server',
        setupText: 'Sync SDK setup',
        docsLink: `https://docs.aerogear.org/aerogear/${docsVersion}/data-sync.html#setup`,

        steps: [
          {
            introduction:
              'Execute following commands in your project directory to install all necessary NPM packages needed for the Sync service:',
            commands: [
              [
                [
                  'Install AeroGear Sync Cordova plugin',
                  '```cordova plugin add @aerogear/cordova-plugin-aerogear-sync```'
                ]
              ]
            ]
          }
        ]
      }
    }
  };

  // add an alias for 'sync' so that will work with both 'sync' and 'sync-app'
  ret.services['sync-app'] = ret.services.sync;
  return ret;
};
export default framework;
