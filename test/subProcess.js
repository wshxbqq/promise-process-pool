"use strict";
/**
 * Created by wangshaoxing on 2016/12/12.
 */

let subProcess = {}

subProcess.main = function (task) {
    process.send({ err: false, task: task });
}

process.on('message', info => {
    subProcess[info.method](info.task)
});
