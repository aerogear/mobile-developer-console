export const appJSON = {
  kind: 'MobileClient',
  apiVersion: 'mdc.aerogear.org/v1alpha1',
  spec: {
    name: 'someapp',
    apiKey: 'a0f5e484-e27c-4cb8-ae35-f2b381d091c5',
    dmzUrl: ''
  },
  status: {
    version: 1,
    namespace: 'myproject',
    clientId: 'someapp',
    services: [
      {
        id: '73b98fba-f2a2-11e8-b76d-0af08791569c',
        name: 'keycloak-a1dd25',
        type: 'keycloak',
        url: 'https://keycloak-a1dd25-myproject.comm2.skunkhenry.com/auth',
        config: {
          'auth-server-url': 'https://keycloak-a1dd25-myproject.comm2.skunkhenry.com/auth',
          'confidential-port': 0,
          'public-client': true,
          realm: 'myproject',
          resource: 'someapp-public',
          'ssl-required': 'external'
        }
      },
      {
        id: '9a3e503d-f41d-11e8-b76d-0af08791569c',
        name: 'metrics',
        type: 'metrics',
        url: 'https://aerogear-app-metrics-myproject.comm2.skunkhenry.com/metrics',
        config: {}
      },
      {
        id: '787d9e34-f41d-11e8-b76d-0af08791569c',
        name: 'sync',
        type: 'sync',
        url: 'https://data-sync-server-myproject.comm2.skunkhenry.com/graphql',
        config: {}
      },
      {
        id: '787d9e34-f41d-11e8-b76d-0af08791569c',
        name: 'badservice',
        type: 'bad-service-type',
        url: 'https://data-sync-server-myproject.comm2.skunkhenry.com/graphql',
        config: {}
      },
      {
        id: '93cdd27e-f41d-11e8-b76d-0af08791569c',
        name: 'ups',
        type: 'push',
        url: 'https://ups-myproject.comm2.skunkhenry.com',
        config: {
          android: {
            senderId: '43543',
            variantId: '87351045-162a-43f3-8a58-5aed717939df',
            variantSecret: '8a8ffc9c-1b70-4edd-9157-bc0e91a2d6f6'
          }
        }
      }
    ]
  }
};

export const framework = docsPrefix => ({
  icon: '/img/xx.png',
  title: 'TestFramework',
  steps: [
    {
      introduction: 'introAll',
      commands: ['text1', ['text2', 'command2'], ['text3', 'command3']]
    },
    {
      introduction:
        'Copy `mobile-services.json` content and copy it to the location `src/mobile-services.json` in your application project.'
    }
  ],
  services: {
    keycloak: {
      serviceLogoUrl: '/img/keycloak.png',
      serviceName: 'Identity Management',
      serviceDescription: 'Identity Management - Identity and Access Management',
      setupText: 'Identity Management SDK setup',
      docsLink: `${docsPrefix}/identity-management.html`,
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
      docsLink: `${docsPrefix}/push-notifications.html`,
      steps: [
        {
          introduction:
            'Execute following commands in your project directory to install all necessary NPM packages needed for the Push Notifications service:',
          commands: [
            [
              'Install Cordova plugin `cordova-plugin-aerogear-push` for push',
              '```cordova plugin add @aerogear/cordova-plugin-aerogear-push```'
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
      docsLink: `${docsPrefix}/mobile-metrics.html`,
      steps: [
        {
          introduction:
            "Metrics is included in all SDK modules, if you already use a component from the AeroGear SDK in your app. You'll need only to install this NPM package to enable it:",
          commands: [
            [
              'Install `cordova-plugin-aerogear-metrics` Cordova plugin',
              '```cordova plugin add @aerogear/cordova-plugin-aerogear-metrics```'
            ]
          ]
        }
      ]
    },
    sync: {
      serviceLogoUrl: '/img/sync.svg',
      serviceName: 'Sync',
      serviceDescription: 'Sync service blabla',
      setupText: 'Sync SDK setup',
      docsLink: `${docsPrefix}/data-sync.html#setup`,

      steps: [
        {
          introduction:
            'Execute following commands in your project directory to install all necessary NPM packages needed for the Sync service:',
          commands: [
            [
              // TODO this needs to be updated after releasing Sync for JS Cordova
            ]
          ]
        }
      ]
    }
  }
});
