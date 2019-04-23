const mobileAppDef = namespace => ({
  name: 'mobileclients',
  version: 'v1alpha1',
  group: 'mobile.k8s.io',
  kind: 'MobileClient',
  namespace
});
const keycloakRealmDef = namespace => ({
  name: 'keycloakrealms',
  version: 'v1alpha1',
  group: 'aerogear.org',
  kind: 'KeycloakRealm',
  namespace
});
// TODO: use the right type definition
const pushVariantDef = namespace => ({
  name: 'pushvariant',
  version: 'v1alpha1',
  group: 'aerogear.org',
  kind: 'PushVariant',
  namespace
});
// TODO: use the right type definition
const metricsApp = namespace => ({
  name: 'metricsApp',
  version: 'v1alpha1',
  group: 'aerogear.org',
  kind: 'MetricsApp',
  namespace
});

export { mobileAppDef, keycloakRealmDef, pushVariantDef, metricsApp };
