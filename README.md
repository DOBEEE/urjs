### 快接单前端通用网络模块

#### 目的
- 统一封装各端的网络模块，请求拦截处理
- 统一网络错误处理，上报
- 统一网络相关等UI展示（错误提示，loading，等等）

### 使用方式

#### 1.引入
```javascript
import { get, post } from adFeRequest;
```

#### 2.发送get请求
```javascript
let res = await get('/yourPath', params);
```

#### 3.发送post请求
```javascript
let res = await post('/yourPath', params);
```

#### 4.定义错误处理及ui
你可以设置type参数：(默认'lte')

```
let res = await post('/yourPath', params, { type: 'lte'});
```
这个请求会展示loading动画，并且再有错误时，会抛出异常，并展示toast信息

type参数有7种可选：

>```
lte : 展示loading动画，抛出异常，展示toast信息
lt  : 展示loading动画，展示toast信息
te  : 抛出异常，展示toast信息
le  : 展示loading动画，抛出异常
l   : 展示loading动画
t   : 展示toast信息
e   : 展示toast信息
```

#### 5.hook
- 如果你想在每个请求发送前做一些事情，你可以设置before参数：

```javascript
let res = await post('/yourPath', params, { before: (args) => {
	// do something
}});
```
before方法的参数是你传入的path和params.

- 如果你想在每个请求响应后做一些事情，你可以设置after参数：

```javascript
let res = await post('/yourPath', params, { after: (ret) => {
	// do something
}});
```
after方法的参数是你请求返回的结果

- 当你在使用hook时，经常会遇到要终止请求的需求，你可以使用AopException：

```javascript
import { get, post, AopException, AOP_EXCEPTION_TPYE } from adFeRequest;
let res = await post('/yourPath', params, { before: (args) => {
	throw new AopException(AOP_EXCEPTION_TPYE.RETURN, {result: 1, a: 1});
}});
console.log(res);
// {result: 1, a: 1}
```
请求将不再发送，直接以你传入的第二个参数作为结果返回
在after里也是一样：

```javascript
import { get, post, AopException, AOP_EXCEPTION_TPYE } from adFeRequest;
let res = await post('/yourPath', params, { after: (ret) => {
	throw new AopException(AOP_EXCEPTION_TPYE.RETURN, {result: 1, a: 1});
}});
console.log(res);
// {result: 1, a: 1}
```
请求发出后会被替换为你传入的数据作为结果返回（通常你可以用它来做结果的统一格式化）

- 如果你想改变请求的参数：

```javascript
import { get, post, AopException, AOP_EXCEPTION_TPYE } from adFeRequest;
let res = await post('/yourPath', params, { before: (...args) => {
	throw new AopException(AOP_EXCEPTION_TPYE.CONTINUE, {path: '/yourPath', params: {}});
}});
```
这里的AopException的第一个参数type决定用哪种方式返回，它有以下几个选项(默认是ignore)：

>return: 直接以当前aop的结果作为目标函数的结果返回,返回用promise外包

>continue: 以当前aop函数的输出结果作为目标函数的参数

>ignore: 忽略



###测试

```
npm run dev
```
默认url ：http://localhost:8091
