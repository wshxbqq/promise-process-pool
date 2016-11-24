# promise-process-pool
基于 promise 的进程池实现

# Usage

默认启动的子文件为 `./subProcess.js` 在进程中默认的函数为 `main`

```javascript
"use strict";
const Pool = require("promise-process-pool");
let tasks1=[1,2,3,4,5];
// fork(./subProcess.js) 
// 并将 task1 传入 subProcess.js 中的 main 函数
var p = new Pool() 
p.run(tasks1).then(arr=>{
    console.log(arr);
});
```


也可以自定义进程池函数

```javascript
// 进程池上线为 8
// fork(./sub.js) 
// 并将 task1 传入 sub.js 中的 myMethod 函数
var p = new Pool(8,"./sub.js","myMethod") 
p.run(tasks1).then(arr=>{
    console.log(arr);
});
```

规定, 一个子进程 send 出来的消息必须携带 err 字段 这里提供一个模板

__subProcess.js:__

```javascript
let subProcess = {}

subProcess.main = function (task) {
    process.send({ err: false, task: task });
}

process.on('message', info => {
    subProcess[info.method](info.task) // info.method 为父进程传递进来的 method 参数
});

```