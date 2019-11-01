import { map } from 'lodash-es';

export const _buildOpenshiftApiUrl = (baseUrl, res) => (res.group ? `${baseUrl}/apis/${res.group}` : `${baseUrl}/api`);

export const _buildOpenShiftUrl = (baseUrl, res) => {
  const urlBegin = `${_buildOpenshiftApiUrl(baseUrl, res)}/${res.version}`;
  if (res.namespace) {
    return `${urlBegin}/namespaces/${res.namespace}/${res.name}`;
  }
  return `${urlBegin}/${res.name}`;
};

export const _buildRequestUrl = res => `${_buildOpenShiftUrl(window.OPENSHIFT_CONFIG.masterUri, res)}`;

export const _buildWatchUrl = res =>
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ''
  }${_buildOpenShiftUrl(window.OPENSHIFT_CONFIG.wssMasterUri, res)}?watch=true`;

export const _labelsToQuery = labels => {
  const labelsArr = map(labels, (value, name) => `${name}%3D${value}`);
  return labelsArr.join(',');
};
