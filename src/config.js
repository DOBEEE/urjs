/**
 * afr配置文件
 *  - afrConf: 配置内容
 *  - set: 配置方法
 */

import Loading from './ui/loading';
import Toast from './ui/toast';
import {
    LogicModules
} from './logic/logic.js';

const afrConf = {
	Toast: Toast,
	Loading: Loading
}
LogicModules.prototype.config = afrConf;

function set(obj) {
	for (let key in afrConf) {
		if (afrConf.hasOwnProperty(key)) {
			afrConf[key] = obj[key] || afrConf[key];
		}
	}
	LogicModules.prototype.config = afrConf;
}

export {
	set
}