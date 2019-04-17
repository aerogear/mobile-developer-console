const mobileAppDef = namespace => ({
  name: 'mobileclients',
  version: 'v1alpha1',
  group: 'mobile.k8s.io',
  kind: 'MobileClient',
  namespace
});

export { mobileAppDef };
