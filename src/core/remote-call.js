import axios from 'axios';

/**
 * axios封装
 *  - getser: get请求
 *  - poster: post请求
 */
class RemoteCall {
    getser({ path, params }) {
        return axios.get(path, params);
    }
    poster({ path, params }) {
        return axios.post(path, params);
    }
}

axios.interceptors.request.use((config) => {
    config.headers['Accept'] = 'application/json';
    config.withCredentials = true;
    return config;
}, (err) => {
    console.error(err);
    return Promise.reject(err);
});

axios.interceptors.response.use((res) => {
    const {data} = res;
    return data;
}, (err) => {
    console.error(err);
    return Promise.reject(err);
});

let rmc = new RemoteCall();

export const getser = rmc.getser;
export const poster = rmc.poster;
