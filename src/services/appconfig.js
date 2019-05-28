import axios from 'axios';

function get(appname) {
  const url = `/api/mobileclient/${appname}/config`;
  return axios.get(url).then(response => response.data);
}

export { get };
