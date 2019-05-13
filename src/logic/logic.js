import { exception } from './err.js';
/**
 * 请求属性
 * @conf {*} 四种属性
 *  - SHOWTOAST: 展示toast
 *  - SHOWLONDING: 展示loading
 *  - THROWERROR: 抛出错误
 *  - RACE: 使用race
 */
const dishConf = {
    SHOWTOAST: 0x1,
    SHOWLONDING: 0x2,
    THROWERROR: 0x4
};

// t l e这四个名称后续得换一下? 或者是单独用四个变量控制展示
const confMap = {
    't': dishConf.SHOWTOAST,
    'l': dishConf.SHOWLONDING,
    'e': dishConf.THROWERROR
}

/**
 * 根据输入type获取conf
 * @param {string} type
 * @return {number} conf
 */
const getConf = (type) => {
    let conf = '';
    let typeArr = [];

    if (typeof type !== 'string') {
        throw new Error('type can only be string')
    }

    typeArr = type.split('');
    const confKeys = Object.keys(confMap)

    if (type.length > confKeys.length || !typeArr.every(t => confKeys.includes(t))) {
        throw new Error(`type can has ${confKeys.length} charactor at most, and only support ${confKeys.toString()}`)
    }
    typeArr.forEach(item => {
        conf = conf | confMap[item]
    })
    return conf;
}

/**
 * @class LogicModules
 *
 * 请求 逻辑处理模块
 * 错误处理，ui逻辑
 */
export class LogicModules {
    constructor(type) {
        this.caller = [];
        this.conf = getConf(type);
        this.Loading = this.config.Loading;
        this.Toast = this.config.Toast;
    }
    addCaller(req) {
        this.caller.push(req);
        return this;
    }
    dispatch() {
        if (this.conf & dishConf.SHOWLONDING) {
            this.Loading();
        }
        let _result = () => Promise.all(this.caller);
        return new Promise((resolve, reject) => {
            _result().then((data) => {
                this.Loading(false);
                /**
                 * 与后端约定result不为1即请求错误
                 * 根据api决定是否向上汇报错误和弹toast
                 */
                for (let it of data) {
                    if (it.result !== 1) {
                        if (this.conf & dishConf.THROWERROR) {
                            reject(exception(it));
                        }
                        if (this.conf & dishConf.SHOWTOAST) {
                            this.Toast(it.msg);
                        }
                    }
                }
                if (data.length === 1) {
                    data = data[0];
                }
                resolve(data);
            }).catch((e) => {
                this.Loading(false);
                /**
                 * 请求异常的情况下，强制抛错，弹toast
                 *
                 */
                reject(e);
                this.Toast('网络异常');
            });
        });
    }
}