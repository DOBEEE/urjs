/**
 * @file aop.js, 函数hook工具
 * @author liguohui@kuaishou.com
 */

 /**
  * 定义一个常量集合
  * @param  {...any} args 常量变量,arg支持的规则
  *     1. arg只能是字符串或者数字，不支持其他数据格式，否则造成key覆盖的问题
  *     2. arg的格式为 "k1=>:v1"
  *         2.1 => : 都是限定符，非可选
  *         2.2 => 代表key和value的映射，如果没有=>，则v1=k1
  *         2.3 :代表保持原样标识，如果没有:,则对v1做Symbol(v1)处理
  *     3. e.g.
  *         3.1 "orange" 被映射为： {'ORANGE': Symbol('orange')}
  *         3.2 'orange => hello' 被映射为: {'ORANGE': Symbol('hello')}
  *         3.3 'orange => :hello' 被映射为: {'ORANGE': 'hello'}
  *         3.4 'orange => :' 被映射为: {'ORANGE': 'orange'}
  * @return Object 返回常量集合，集合的key是args种arg的大写，value参考args的规则
  */
function define(...args) {
    let r = {};
    for (let v of args.map(s => ('' + s).replace(/ /g, ''))) {
        let [k1, v1 = k1] = v.split('=>');
        let keep = v1.startsWith(':');
        if (keep) {
            v1 = (v1 === ':' ? k1 : v1.substr(1));
        }
        // v1 = (v1 === ':' ? k1 : v1.substr(1));
        r[k1.toUpperCase()] = (keep ? v1 : Symbol(v1));
    }
    return r;
}

/**
 * 定义AOP异常类型，在aop函数中可以主动throw的方式中断原函数路径
 * RETURN: 直接以当前aop的结果作为目标函数的结果返回,返回用promise外包
 * CONTINUE: 以当前aop函数的输出结果作为目标函数的参数
 * IGNORE: 忽略
 */
const AOP_EXCEPTION_TPYE = define('return', 'continue', 'ignore');

/**
 * AOP异常类，注意这里的异常不是真正意义的异常，而是用来控制AOP函数对目标函数的路径影响
 */
class AopException {
    /**
     * 构造函数，异常只作用于before和then
     * @param {*} type 异常类型
     * @param {*} params 异常附带参数
     *  - RETURN: 直接以当前aop的结果作为目标函数的结果返回,返回用promise外包
     *  - CONTINUE: 以当前aop函数的输出结果作为目标函数的参数
     *  - IGNORE: 忽略
     */
    constructor(type = AOP_EXCEPTION_TPYE.IGNORE, trans) {
        this.mType = type;
        this.mTrans = trans;
    }

    exception() {
        return {type: this.mType, trans: this.mTrans};
    }

    toString() {
        return `AopException(${this.mType}, ${this.mTrans})`;
    }
}
/* eslint-disable */

/**
 * Aop切面类，提供更多选择性，可以hook函数调用前 调用后。如果是promise，可以hookpromise的then
 * 该类将target转化成一个切面对象，通过切面对象的call方式来执行target函数
 * @Note 切面函数发生异常，会导致正常流程退出
 */
class Aop {
    /**
     * 目标hook函数
     * @param {Function} target 目标函数
     */
    constructor(target) {
        this.mTarget = target;
        this.mBefores = [];
        this.mAfters = [];
    }

    /**
     * 前置hook，hook可以设置多个
     * @param {Function} cb 回掉函数，必须是函数
     */
    before(cb = (...args) => 0) {
        typeof cb === 'function' && this.mBefores.push(cb);
        return this;
    }

    /**
     * 后置hook，hook可以设置多个
     * @param {Function} cb 回掉函数，必须是函数
     */
    after(cb = ret => 0) {
        typeof cb === 'function' && this.mAfters.push(cb);
        return this;
    }

    /**
     * 真正调用，Aop对象的call才是真正调用原函数
     * @param  {...any} args 参数
     */
    call(...args) {
        for (let cb of this.mBefores) {
            try {
                cb(...args);
            } catch (e) {
                if (e instanceof AopException) {
                    let {type, trans} = e.exception();
                    if (type === AOP_EXCEPTION_TPYE.RETURN) {
                        return Promise.resolve(trans);
                    } else if (type === AOP_EXCEPTION_TPYE.CONTINUE) {
                        args = [{...args[0], ...trans}];
                    }
                }
            }
        }

        let ret = this.mTarget(...args);
        ret.then((data) => {
            for (let cb of this.mAfters) {
                try {
                    cb(data);
                } catch (e) {
                    if (e instanceof AopException) {
                        let {type, trans} = e.exception();
                        if (type === AOP_EXCEPTION_TPYE.RETURN) {
                            return Promise.resolve(trans);
                        } else if (type === AOP_EXCEPTION_TPYE.CONTINUE) {
                            data = trans || data;
                            return Promise.resolve(data);
                        }
                    }
                }
            }
        });
        
        return ret;
    }
}
// 使用示例！！！！勿删！！！
// function aop_test(a, b, c) {
//     console.log(a, b, c);
//     return Promise.resolve([a, b, c]);
// }

// console.log(aop(aop_test, (a, b, c) => console.log('before', a, b, c))('he', 'll', 'o'));

// new Aop(aop_test).
//     before((...args) => console.log('before', ...args)).
//     after(ret => console.log('after', ret)).
//     then(ret => 'then1').
//     then(data => console.log('then', data)).
//     call(1,2,3,4,5,5,6,7,7,8,8,89);
// 中断示例
// new Aop(aop_test).
//     before((...args) => throw new AopException('continue', {a: 1})).
//     after(ret => console.log('after', ret)).
//     call(1,2,3,4,5,5,6,7,7,8,8,89);

export {
    define,
    AOP_EXCEPTION_TPYE,
    AopException,
    Aop,
};
/* eslint-enable */
