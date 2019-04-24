const PUSH_SERVIE_TYPE = 'push';
const IDM_SERVICE_TYPE = 'keycloak';
const METRICS_SERVICE_TYPE = 'metrics';

const PushService = {
  type: PUSH_SERVIE_TYPE,
  name: 'Push Notification',
  icon: '/img/push.svg',
  description: 'Unified Push Server',
  bindForm: {
    schema: {
      $schema: 'http://json-schema.org/draft-04/schema',
      additionalProperties: false,
      properties: {
        CLIENT_ID: {
          title: 'Mobile Client ID',
          type: 'string'
        },
        CLIENT_TYPE: {
          default: 'Android',
          enum: ['Android', 'IOS'],
          title: 'Mobile Client Type',
          type: 'string'
        },
        cert: {
          title: 'iOS .p12 file (encode contents in base64 before pasting)',
          type: 'string'
        },
        googlekey: {
          title: 'Your Server Key for Firebase Cloud Messaging',
          type: 'string'
        },
        iosIsProduction: {
          default: false,
          title: 'Is this a production certificate?',
          type: 'boolean'
        },
        passphrase: {
          title: 'The passphrase',
          type: 'string'
        },
        projectNumber: {
          title: 'Your Sender ID, needed to connecting to FCM',
          type: 'string'
        }
      },
      required: ['CLIENT_ID', 'CLIENT_TYPE'],
      type: 'object'
    },
    definition: [
      'CLIENT_ID',
      'CLIENT_TYPE',
      {
        items: ['googlekey', 'projectNumber'],
        title: 'Android',
        type: 'fieldset',
        filterDisplayGroupBy: 'CLIENT_TYPE'
      },
      {
        items: [
          {
            key: 'cert',
            type: 'textarea'
          },
          {
            key: 'passphrase',
            type: 'password'
          },
          {
            key: 'iosIsProduction',
            type: 'checkbox'
          }
        ],
        title: 'iOS',
        type: 'fieldset',
        filterDisplayGroupBy: 'CLIENT_TYPE'
      }
    ]
  }
};

const IdentityManagementService = {
  type: IDM_SERVICE_TYPE,
  name: 'Identity Management',
  icon: '/img/keycloak.svg',
  description: 'Identity Management Service',
  bindForm: {
    schema: {
      $schema: 'http://json-schema.org/draft-04/schema',
      additionalProperties: false,
      properties: {
        CLIENT_ID: {
          title: 'Mobile client ID/Service ID',
          type: 'string'
        },
        CLIENT_TYPE: {
          default: 'public',
          enum: ['bearer', 'public'],
          title: 'Client type',
          type: 'string'
        }
      },
      required: ['CLIENT_ID', 'CLIENT_TYPE'],
      type: 'object'
    },
    definition: ['CLIENT_ID', 'CLIENT_TYPE']
  }
};

const MetricsService = {
  type: METRICS_SERVICE_TYPE,
  name: 'Mobile App Metrics',
  icon: '/img/metrics.svg',
  description: 'Mobile App Metrics Service',
  bindForm: {
    schema: {
      $schema: 'http://json-schema.org/draft-04/schema',
      additionalProperties: false,
      properties: {
        CLIENT_ID: {
          title: 'Mobile Client ID',
          type: 'string'
        }
      },
      required: ['CLIENT_ID'],
      type: 'object'
    },
    definition: ['CLIENT_ID']
  }
};

const MobileServicesMap = {
  [PUSH_SERVIE_TYPE]: PushService,
  [IDM_SERVICE_TYPE]: IdentityManagementService,
  [METRICS_SERVICE_TYPE]: MetricsService
};

module.exports = { MobileServicesMap, PushService, IdentityManagementService, MetricsService };
