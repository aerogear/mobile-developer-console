import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getNamespace, getMasterUri, getUser, get, update, list, create, remove } from './openshift';

describe('OpenShiftWatchEventListener', () => {
  let mock;
  let openShiftConfig;
  const mockResource = {
    name: 'mobileclients',
    group: 'test.api.group',
    version: 'v1',
    namespace: window.OPENSHIFT_CONFIG.mdcNamespace
  };
  const mockResponse = {
    apiVersion: 'mdc.aerogear.org/v1alpha1',
    kind: 'MobileClient',
    metadata: {
      creationTimestamp: '2019-07-02T13:40:32Z',
      generation: 1,
      name: 'myapp',
      namespace: window.OPENSHIFT_CONFIG,
      resourceVersion: '239554',
      selfLink: '/apis/mdc.aerogear.org/v1alpha1/namespaces/mobile-console/mobileclients/myapp',
      uid: 'f6a58d89-9cce-11e9-aaec-525400f46a9b'
    },
    spec: { name: 'myapp' },
    status: { clientId: 'myapp', namespace: window.OPENSHIFT_CONFIG, services: [] }
  };

  const mockObj = {
    apiVersion: 'mdc.aerogear.org/v1alpha1',
    kind: 'MobileClient',
    metadata: {
      creationTimestamp: '2019-07-02T13:40:32Z',
      generation: 1,
      name: 'myapp',
      namespace: window.OPENSHIFT_CONFIG,
      resourceVersion: '239554',
      selfLink: '/apis/mdc.aerogear.org/v1alpha1/namespaces/mobile-console/mobileclients/myapp',
      uid: 'f6a58d89-9cce-11e9-aaec-525400f46a9b'
    },
    spec: { name: 'myapp' },
    status: { clientId: 'myapp', namespace: window.OPENSHIFT_CONFIG, services: [] }
  };

  beforeAll(() => {
    openShiftConfig = { ...window.OPENSHIFT_CONFIG };
  });

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  beforeEach(() => {
    window.OPENSHIFT_CONFIG = { ...openShiftConfig };
  });

  describe('getNamespace()', () => {
    it('should return the correct namespace', () => {
      const namespace = getNamespace();

      expect(namespace).toEqual(window.OPENSHIFT_CONFIG.mdcNamespace);
    });

    it('should return undefined', () => {
      window.OPENSHIFT_CONFIG = undefined;

      const namespace = getNamespace();

      expect(namespace).toBeUndefined();
    });
  });

  describe('getMasterUri()', () => {
    it('should return the correct master URI', () => {
      const masterUri = getMasterUri();

      expect(masterUri).toEqual(window.OPENSHIFT_CONFIG.masterUri);
    });

    it('should return undefined', () => {
      window.OPENSHIFT_CONFIG = undefined;

      const masterUri = getMasterUri();

      expect(masterUri).toBeUndefined();
    });
  });

  describe('getUser()', () => {
    it('should return the user', () => {
      getUser().then(user => {
        expect(user).toEqual(window.OPENSHIFT_CONFIG.user);
      });
    });

    it('should fail to return the object', () => {
      window.OPENSHIFT_CONFIG = undefined;
      return getUser().catch(err => {
        expect(err).toEqual(new Error('no user found'));
      });
    });
  });

  describe('get()', () => {
    const name = 'test1';
    const url = `${window.OPENSHIFT_CONFIG.masterUri}/apis/${mockResource.group}/${mockResource.version}/namespaces/${mockResource.namespace}/${mockResource.name}/${name}`;

    it('should return success', () => {
      mock.onGet(url).reply(200, mockResponse);

      return get(mockResource, name).then(res => {
        expect(res).toEqual(mockResponse);
      });
    });

    it('should fail', () => {
      mock.onGet(url).reply(403);

      return get(mockResource, name).catch(err => {
        expect(err).toEqual(new Error('Request failed with status code 403'));
      });
    });
  });

  describe('update()', () => {
    const url = `${window.OPENSHIFT_CONFIG.masterUri}/apis/${mockResource.group}/${mockResource.version}/namespaces/${mockResource.namespace}/${mockResource.name}/${mockObj.metadata.name}`;

    it('should return success', () => {
      mock.onPut(url, mockObj).reply(200, mockResponse);

      return update(mockResource, mockObj).then(res => {
        expect(res).toEqual(mockResponse);
      });
    });

    it('should fail', () => {
      mock.onPut(url).reply(403);

      return update(mockResource, mockObj).catch(err => {
        expect(err).toEqual(new Error('Request failed with status code 403'));
      });
    });
  });

  describe('list()', () => {
    const url = `${window.OPENSHIFT_CONFIG.masterUri}/apis/${mockResource.group}/${mockResource.version}/namespaces/${mockResource.namespace}/${mockResource.name}`;

    it('should return success', () => {
      mock.onGet(url).reply(200, mockResponse);

      return list(mockResource).then(res => {
        expect(res).toEqual(mockResponse);
      });
    });

    it('should fail', () => {
      mock.onGet(url).reply(500);

      return list(mockResource).catch(err => {
        expect(err).toEqual(new Error('Request failed with status code 500'));
      });
    });
  });

  describe('create()', () => {
    const url = `${window.OPENSHIFT_CONFIG.masterUri}/apis/${mockResource.group}/${mockResource.version}/namespaces/${mockResource.namespace}/${mockResource.name}`;

    it('should return success', () => {
      mock.onPost(url, mockObj).reply(200, mockResponse);

      return create(mockResource, mockObj).then(res => {
        expect(res).toEqual(mockResponse);
      });
    });

    it('should fail', () => {
      mock.onPost(url, mockObj).reply(409);

      return create(mockResource, mockObj).catch(err => {
        expect(err).toEqual(new Error('Request failed with status code 409'));
      });
    });
  });

  describe('remove', () => {
    const url = `${window.OPENSHIFT_CONFIG.masterUri}/apis/${mockResource.group}/${mockResource.version}/namespaces/${mockResource.namespace}/${mockResource.name}/${mockObj.metadata.name}`;

    it('should return success', () => {
      mock.onDelete(url, mockObj).reply(200, mockResponse);

      return remove(mockResource, mockObj).then(res => {
        expect(res).toEqual(mockResponse);
      });
    });

    it('should fail', () => {
      mock.onDelete(url, mockObj).reply(403);

      return remove(mockResource, mockObj).catch(err => {
        expect(err).toEqual(new Error('Request failed with status code 403'));
      });
    });
  });
});
