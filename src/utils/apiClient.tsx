import axios from 'axios';

const options = {
  headers: {
    'Content-type': 'application/json',
  },
};

const apiClient = {
  get: (url: string, params?: object) =>
    axios.get(url, {
      ...options,
      ...params,
    }),
  post: (url: string, data: object) => axios.post(url, data, options),
  patch: (url: string, data: object) => axios.post(url, data, options),
  delete: (url: string) => axios.post(url, options),
};

export default apiClient;
