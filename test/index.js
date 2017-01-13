"use strict";
const path = require("path");
const os = require("os");
const Pool = require("../index");
const subJS = path.join(__dirname, "subProcess.js")
const cpuCount = os.cpus().length;

let tasks1=[1,2,3,4,5];
let tasks2=[3,4,5,6,7];

var p = new Pool(cpuCount,subJS,"main")
p.run(tasks1).then(arr=>{
    console.log(arr);
});

var p1 = new Pool(cpuCount,subJS,"main")
p1.run(tasks2).then(arr=>{
    console.log(arr);
});