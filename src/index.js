import { AopException, AOP_EXCEPTION_TPYE } from './core/aop.js';
import { get, post } from './logic/request.js';
import { set } from './config.js';

const afr = {
	get, post
}
export {
    AopException,
    AOP_EXCEPTION_TPYE,
    get,
    post,
    afr,
    set
};
