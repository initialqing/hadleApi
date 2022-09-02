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
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    };
    // 获取MyBind传入的参数，这个类数组的第一位是this所以索引从1开始
    const args = Array.prototype.slice.call(arguments, 1)
    const self = this
    const fn = function () {}
    const bind = function () {
        // 二次调的时候同样抓取参数
        const params = Array.prototype.slice.call(arguments)
        self.apply(this.constructor === self ? this : obj, args.concat(params))
    }
    fn.prototype = self.prototype
    bind.prototype = new fn()
    return bind
}


function testBind(a, b) {
    console.log('this:', this.name);
    // console.log(a+b)
    return a + b
}

const bindObj = { name: 'qing', age: 18 };
const bindFun = testBind.MyBind(bindObj, 1)
console.log(bindFun({ name: 'change' }, 2));


//函数柯里化，函数调用的时候先传递一部分参数进行调用，函数返回新函数再处理剩下的参数
function fn(x, y) {
    return function (y) {
        console.log(x + y);
    };
};
var fn_ = fn(0); // 先传递一个x参数
fn_(1); // 2 此时返回了一个新的fn_函数，在传入一个参数y处理剩余的参数
fn(1)(1) // 2
