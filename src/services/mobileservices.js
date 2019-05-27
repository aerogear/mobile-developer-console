import axios from 'axios';

class MobileServices {
  constructor() {
    this.apiUrl = '/api/mobileservices';
  }

  list() {
    return axios.get(this.apiUrl).then(response => response.data);
  }
}

const mobileServices = new MobileServices();
export { mobileServices, MobileServices };
