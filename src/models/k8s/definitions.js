const mobileAppDef = namespace => ({
  name: 'mobileclients',
  version: 'v1alpha1',
  group: 'mdc.aerogear.org',
  kind: 'MobileClient',
  namespace
});
const buildsDef = namespace => ({
  name: 'builds',
  version: 'v1',
  group: 'build.openshift.io',
  kind: 'Build',
  namespace
});
const buildConfigsDef = namespace => ({
  name: 'buildconfigs',
  version: 'v1',
  group: 'build.openshift.io',
  kind: 'BuildConfig',
  namespace
});
const buildConfigInstantiateDef = namespace => name => ({
  name: `buildconfigs/${name}/instantiate`,
  version: 'v1',
  group: 'build.openshift.io',
  kind: 'BuildRequest',
  namespace
});
const secretsDef = namespace => ({
  name: 'secrets',
  version: 'v1',
  kind: 'Secret',
  namespace
});

export { mobileAppDef, buildsDef, buildConfigsDef, buildConfigInstantiateDef, secretsDef };
