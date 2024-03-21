import axios from 'axios';

const Api = axios.create({
  baseURL:'https://final-destination-server-dev-faae.4.us-1.fl0.io/check-out'
  // baseURL: 'http://localhost:8080/'

});
export default Api;
