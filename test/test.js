import {
    get,
    post,
    AopException,
    AOP_EXCEPTION_TPYE,
    set
} from '@/index.js';
set({
    Toast: () => {
        console.log('已替换');
    },
    Loading: () => {
        console.log('已替换');
    }
});
window.clickHandle = async (e) => {
    let res = await post('/rest/list', {a: 1, b: 2}, {
        type: 'tle',
        before: (args) => {
            throw new AopException(AOP_EXCEPTION_TPYE.CONTINUE, {path: '/rest/list', params: {b: 3, c: 1}});
        }
    });
    console.log(res);
}
