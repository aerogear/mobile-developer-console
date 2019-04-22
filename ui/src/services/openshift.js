import axios from 'axios';
import { map } from 'lodash-es';

const OpenShiftWatchEvents = Object.freeze({
  MODIFIED: 'MODIFIED',
  ADDED: 'ADDED',
  DELETED: 'DELETED',
  OPENED: 'OPENED',
  CLOSED: 'CLOSED'
});

class OpenShiftWatchEventListener {
  _handler = () => {};
  _errorHandler = () => {};

  constructor(socket) {
    this._socket = socket;
  }

  init() {
    this._socket.onmessage = event => {
      const data = JSON.parse(event.data);
      this._handler({ type: data.type, payload: data.object });
    };
    this._socket.oncreate = () => this._handler({ type: OpenShiftWatchEvents.OPENED });
    this._socket.onclose = () => this._handler({ type: OpenShiftWatchEvents.CLOSED });
    this._socket.onerror = err => this._errorHandler(err);
    return this;
  }

  onEvent(handler) {
    this._handler = handler;
    return this;
  }

  catch(handler) {
    this._errorHandler = handler;
    return this;
  }
}

const getUser = () => {
  if (window.OPENSHIFT_CONFIG && window.OPENSHIFT_CONFIG.user) {
    return Promise.resolve(Object.freeze(window.OPENSHIFT_CONFIG.user));
  }
  return Promise.reject(new Error('no user found'));
};

const get = (res, name) =>
  getUser().then(user =>
    axios({
      url: `${window.OPENSHIFT_CONFIG.masterUri}/apis/${res.group}/${res.version}/namespaces/${res.namespace}/${
        res.name
      }/${name}`,
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data)
  );

const update = (res, obj) =>
  getUser().then(user => {
    const requestUrl = _buildRequestUrl(res);

    if (!obj.apiVersion) {
      obj.apiVersion = res.group ? `${res.group}/${res.version}` : res.version;
    }

    return axios({
      url: `${requestUrl}/${obj.metadata.name}`,
      method: 'PUT',
      data: obj,
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data);
  });

const list = res =>
  getUser().then(user =>
    axios({
      url: _buildRequestUrl(res),
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data)
  );

const create = (res, obj) =>
  getUser().then(user => {
    const requestUrl = _buildRequestUrl(res);

    if (!obj.apiVersion) {
      obj.apiVersion = res.group ? `${res.group}/${res.version}` : res.version;
    }
    if (!obj.kind && res.kind) {
      obj.kind = res.kind;
    }

    return axios({
      url: requestUrl,
      method: 'POST',
      data: obj,
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data);
  });

const remove = (res, obj) =>
  getUser().then(user => {
    const requestUrl = _buildRequestUrl(res);

    if (!obj.apiVersion) {
      obj.apiVersion = res.group ? `${res.group}/${res.version}` : res.version;
    }
    if (!obj.kind && res.kind) {
      obj.kind = res.kind;
    }

    return axios({
      url: `${requestUrl}/${obj.metadata.name}`,
      method: 'DELETE',
      data: {
        apiVersion: obj.apiVersion,
        kind: 'DeleteOptions',
        propogationPolicy: 'Foreground'
      },
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data);
  });

const watch = res =>
  getUser().then(user => {
    const watchUrl = _buildWatchUrl(res);
    const base64token = window.btoa(user.accessToken).replace(/=/g, '');
    const socket = new WebSocket(watchUrl, [`base64url.bearer.authorization.k8s.io.${base64token}`, null]);

    return Promise.resolve(new OpenShiftWatchEventListener(socket).init());
  });

const listWithLabels = (res, labels) => {
  let reqUrl = _buildRequestUrl(res);
  if (labels) {
    reqUrl = `${reqUrl}?labelSelector=${_labelsToQuery(labels)}`;
  }
  return getUser().then(user => {
    axios({
      url: reqUrl,
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data);
  });
};

const _buildOpenshiftApiUrl = (baseUrl, res) => (res.group ? `${baseUrl}/apis/${res.group}` : `${baseUrl}/api`);

const _buildOpenShiftUrl = (baseUrl, res) => {
  const urlBegin = `${_buildOpenshiftApiUrl(baseUrl, res)}/${res.version}`;
  if (res.namespace) {
    return `${urlBegin}/namespaces/${res.namespace}/${res.name}`;
  }
  return `${urlBegin}/${res.name}`;
};

const _buildRequestUrl = res => `${_buildOpenShiftUrl(window.OPENSHIFT_CONFIG.masterUri, res)}`;

const _buildWatchUrl = res => `${_buildOpenShiftUrl(window.OPENSHIFT_CONFIG.wssMasterUri, res)}?watch=true`;

const _labelsToQuery = labels => {
  const labelsArr = map(labels, (value, name) => `${name}%3D${value}`);
  return labelsArr.join(',');
};

export { get, create, list, watch, update, remove, OpenShiftWatchEvents, getUser, listWithLabels };
