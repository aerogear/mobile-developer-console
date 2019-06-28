import { map } from 'lodash-es';
import axios from 'axios';
import { OpenShiftWatchEvents } from './OpenShiftWatchEvents';

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

/* eslint-disable class-methods-use-this */

export class GenericResourceManager {
  create(user, res, obj, owner) {
    const requestUrl = _buildRequestUrl(res);

    if (!obj.apiVersion) {
      obj.apiVersion = res.group ? `${res.group}/${res.version}` : res.version;
    }
    if (!obj.kind && res.kind) {
      obj.kind = res.kind;
    }
    if (owner) {
      obj.metadata.ownerReferences = [
        {
          apiVersion: owner.apiVersion,
          kind: owner.kind,
          blockOwnerDeletion: false,
          name: owner.metadata.name,
          uid: owner.metadata.uid
        }
      ];
    }

    return axios({
      url: requestUrl,
      method: 'POST',
      data: obj,
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data);
  }

  remove(user, res, obj) {
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
  }

  update(user, res, obj) {
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
  }

  list(user, res, labels) {
    let reqUrl = _buildRequestUrl(res);
    if (labels) {
      reqUrl = `${reqUrl}?labelSelector=${_labelsToQuery(labels)}`;
    }
    return axios({
      url: reqUrl,
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data);
  }

  watch(user, res) {
    const watchUrl = _buildWatchUrl(res);
    const base64token = window.btoa(user.accessToken).replace(/=/g, '');
    const socket = new WebSocket(watchUrl, [`base64url.bearer.authorization.k8s.io.${base64token}`, null]);

    return Promise.resolve(new OpenShiftWatchEventListener(socket).init());
  }

  get(user, res, name) {
    axios({
      url: `${window.OPENSHIFT_CONFIG.masterUri}/apis/${res.group}/${res.version}/namespaces/${res.namespace}/${res.name}/${name}`,
      headers: {
        authorization: `Bearer ${user.accessToken}`
      }
    }).then(response => response.data);
  }
}
