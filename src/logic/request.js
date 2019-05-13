/**
 * @file request
 *
 * @params type 请求类型
 * @params params 请求参数
 * @params path 请求路径
 * @params before request前hook
 *         args为{path, params}
 * @params after request后hook
 *         args为
 */
import {
    gets,
    posts
} from './hook.js';
import {
    LogicModules
} from './logic.js';

const getWrappedRequest = (fn) => {
    return function (path = '', params = {}, reqParams = {
        type: 'lte',
        before: '',
        after: ''
    }) {
        let {type = 'lte', before = '', after = ''} = reqParams;
        return new LogicModules(type).addCaller(fn(path, params, before, after)).dispatch();
    }
}
export const all = (reqs) => {
    return Promise.all(reqs);
}
export const race = (reqs) => {
    return Promise.race(reqs);
}

export const get = getWrappedRequest(gets);
export const post = getWrappedRequest(posts);
