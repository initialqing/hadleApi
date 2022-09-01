// 任何函数都可以调用call方法所以需要把call方法写在Function原型上
// 方法传入两个参数，第一参数为调用函数的this，第二个为调用这个函数传入的参数

Function.prototype.MyCall = function (thisArg = window, ...args) {

    const prop = Symbol()
    // 处理传入进来的函数,将它作为thisArg的一个属性
    thisArg[prop] = this
    let res = thisArg[prop](...args)

    delete thisArg[prop]
    return res
}


function fn(a, b) {
    console.log(a, b)
    console.log('this:', this)
    return a + b
}

const obj = {
    name: 'qingcc'
}
// const res1 = fn.MyCall(obj,10,20)
// console.log(res3)


function Product(name, price) {
    this.name = name;
    this.price = price;
}

function Food(name, price) {
    Product.MyCall(this, name, price);
    this.category = 'food';
}

function Toy(name, price) {
    Product.MyCall(this, name, price);
    this.category = 'toy';
}

var cheese = new Food('feta', 5);
var fun = new Toy('robot', 40);

// console.log(cheese)
// console.log(fun)

// ----------------------------------------------------------------------手写apply的实现

function testApply(a = 12, b = 10) {
    console.log('this:', this)
    console.log(a, b)
    return a + b
}


Function.prototype.MyApply = function (obj = window, arr) {
    obj = (obj !== undefined && obj !== null) ? Object(obj) : window
    const prop = Symbol()
    obj[prop] = this
    const argArr = arr || []
    const res = obj[prop](...argArr)
    delete obj[prop]
    return res
}

// const res = testApply.MyApply({ name: 'string', age: 18 }, [1, 2])
// console.log(res)

// -----------------------------------------------------------------------手写bind的实现

Function.prototype.MyBind = function (obj) {
    // 获取MyBind传入的参数
    const args = Array.prototype.slice(arguments, 1)
    const self = this
    return function () {
        self.call(obj,args)
    }
}

function testBind(a = 1, b = 2) {
    console.log('this:', this.name);
    return a + b
}

const bindObj = { name: 'qing', age: 18 };
const bindFun = testBind.MyBind(bindObj)
bindFun()


//函数柯里化
function fn(x, y) {
    return function (y) {
        console.log(x + y);
    };
};
var fn_ = fn(0);
fn_(0); //2

fn(1)(1) //2