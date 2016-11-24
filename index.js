"use strict"

const fork = require('child_process').fork;
const cpus = require('os').cpus().length;

/**
 * @param processCount {number} 启动的进程数
 * @param subProcessFile {string} 要启动的文件
 * @param subMethodName {string} 在子进程中调用的方法
 */
const ProcessPoll = function (processCount, subProcessFile, subMethodName) {
    if (typeof (processCount) == "string") {
        subProcessFile = processCount;
        subMethodName = "main";
        processCount = cpus;
    }
    this.processCount = processCount || cpus;
    this.subProcessFile = subProcessFile || "./subProcess.js";
    this.subMethodName = subMethodName || "main"
    this.tasks = [];
    this.process = [];
    this._status = 0; //0 未启动 1 正在执行 2已完成
}

/**
 * @param tasks {Array} 任务数组
 */
ProcessPoll.prototype.run = function (tasks) {
    if (this._status > 0) {
        throw "this ref is closed"
    };
    let _this = this;
    _this._status = 1;
    _this.tasks = tasks;

    let _tasks = [];
    tasks.map(val => {
        _tasks.push(val)
    })

    let idx = -1;
    let result = [];
    for (let i = 0; i < _this.processCount; i++) {
        let pPromise = new Promise((resolve, reject) => {
            let subProc = fork(_this.subProcessFile);
            subProc.jobDone = 0;
            subProc.idx;
            let sendTask = () => {
                let task = _tasks.shift();
                if (task) {
                    idx++;
                    subProc.idx = idx;
                    subProc.send({
                        task: task,
                        method: _this.subMethodName
                    });
                } else {
                    subProc.disconnect();
                    resolve();
                }
            }
            subProc.on('message', data => {
                result[subProc.idx] = data;
                subProc.jobDone++;
                if (!data.err) {
                    sendTask();
                } else {
                    reject(data)
                }
            })
            sendTask();
        });
        _this.process.push(pPromise);
    }
    return Promise.all(_this.process).then(arr=>{
        return result;
    })
}

module.exports = ProcessPoll;