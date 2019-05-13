import { Aop } from '../core/aop.js';
import { getser, poster } from '../core/remote-call.js';

/**
 * get、post方法hook
 * @desc 插入before、after
 * @param {*} params 调用参数
 *  - path: 请求路径
 *  - params: 请求参数
 *  - before: 请求前hook
 *  - after: 请求后hook
 */
function hook(fn, path, params, before, after) {
    return new Aop(fn)
        .before(( ...args ) => {
            if (typeof before === 'function') {
                before(...args);
            }
        })
        .after(ret => {
            if (typeof after === 'function') {
                after(ret);
            }
        })
        .call({path, params});
}
export function gets(path, params, before, after) {
    return hook(getser, path, params, before, after);
}

export function posts(path, params, before, after) {
    return hook(poster, path, params, before, after);
}
