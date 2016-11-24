"use strict";

const Pool = require("./index");


let tasks1=[1,2,3,4,5];
let tasks2=[3,4,5,6,7]
var p = new Pool()
p.run(tasks1).then(arr=>{
    console.log(arr);
});

var p1 = new Pool()
p1.run(tasks2).then(arr=>{
    console.log(arr);
});