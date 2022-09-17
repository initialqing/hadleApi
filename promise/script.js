class Promise {
    constructor(executor) {
        // 添加属性
        this.PromiseState = 'pending'
        this.PromiseResult = null
        this.callBacks = []
        const self = this
        // resolve 函数
        function resolve(data) {
            // 状态改变一次
            if (self.PromiseState!=='pending') {
                return
            }
            // 修改对象的状态(promiseState)，设置结果值(promiseResult)
            self.PromiseState = 'fulfilled'
            self.PromiseResult =  data
            // 调用成功的回调函数
            // self.callBack.onResolved()
            // if (self.callBack.onResolved) {
            //     self.callBack.onResolved(data)
            // }
            // 异步执行
            setTimeout(() => {
                self.callBacks.forEach(item => {
                    item.onResolved()
                })
            })
        }
        // reject 函数
        function reject(data) {
            // 状态改变一次
            if (self.PromiseState!=='pending') {
                return
            }
            self.PromiseResult = data
            self.PromiseState = 'rejected'
            // self.callBack.onRejected()
            // if (self.callBack.onRejected) {
            //     self.callBack.onRejected(data)
            // }
            // 异步执行
            setTimeout(()=> {
                self.callBacks.forEach(item => {
                    item.onRejected()
                })
            })
        }
        // 同步调用执行器函数
        try {
            executor(resolve,reject)
        } catch (error) {
            // 修改promise对象为失败
            reject(error)
        }
    }
    //then方法
    then(onResolved,onRejected) {
        const self = this
        // 判断回调函数参数
        if (typeof onRejected !== 'funtion') {
            onRejected = reason => {
                throw reason
            }
        }
        if(typeof onResolved !== 'function') {
            onResolved = value => value
        }
        return new Promise((resolve,reject) => {
            //封装函数
            function callback(type) {
                try {
                    let result = type(self.PromiseResult)
                    // 获取函数的执行结果,如果结果是Promise的一个实例
                    if (result instanceof Promise) {
                        // 如果是promise
                        result.then(v => {
                            resolve(v)
                        },r=>{
                            reject(r)
                        })
                    }else{
                        // 结果状态为成功
                        resolve(result)
                    }
                } catch (error) {
                    reject(error)
                }
            }
                //调用回调函数
        if (this.PromiseState==='fulfilled') {
            setTimeout(() => {
                callback(onResolved)
            })
        }
        if (this.PromiseState==='rejected') {
            // let result = onRejected(this.PromiseResult)
            setTimeout(() => {
                callback(onRejected)   
            })    
        }
        // 判断pending的状态
        if (this.PromiseState==='pending') {
            // 保存回调函数,这种方法保存回调函数只会执行一次
            // this.callBack = {
                // onResolved,
                // onRejected
            // }
            this.callBacks.push({
                onResolved:function(){
                    // 执行成功的回调函数
                    callback(onResolved)
                },
                onRejected:function(){
                    callback(onRejected)              
                }
            })
        }
        })
    }
    catch(onRejected){
        return this.then(undefined,onRejected)
    }
    static resolve(value){
        return new Promise((resolve,reject) => {
            if(value instanceof Promise) {
                value.then(v => {resolve(v)},r => {reject(r)})
            }else {
                resolve(value)
            }
        })
    }
    static reject(reason){
        return new Promise((resolve,reject) => {
            reject(reason)
        })
    }
    static all (promises) {
        return new Promise((resolve,reject) => {
            let arr = []
            for(let i = 0;i<promises.length;i++) {
                promises[i].then(v => {
                    arr[i] = v
                    if(i===promises.length-1) {
                        resolve(arr)
                    }
                },r => {
                    reject(r)
                })
            }
        })
    }
    static race (promises) {
        return new Promise((resolve,reject) => {
            for(let i = 0;i<promises.length;i++) {
                promises[i].then(v => {
                    resolve(v)
                },r => {
                    reject(r)
                })
            }
        })
    }
}