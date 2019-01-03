const axios = require('axios')

const api = "http://localhost:4000/api"

const sendRequest = async (method, path, data) => {
  let headers
  if (method === "POST") {
    headers = {'Content-Type': 'application/json'}
  }
  try {
    return await axios({
      url: `${api}/${path}`,
      method,
      data,
      headers
    })
  } catch (error) {
    return error.response;
  }
}

module.exports = sendRequest
