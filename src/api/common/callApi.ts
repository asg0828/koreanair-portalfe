import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL ? JSON.parse(process.env.REACT_APP_API_URL)['KAL_BE'] : '';
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 5000;

const callApi = {
  get: (url: string, params?: object) => axios.get(url, { params }),
  post: (url: string, data: object) => axios.post(url, data),
};

export default callApi;
