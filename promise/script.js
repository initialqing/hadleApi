class Promise {
    constructor(executor) {
        this.promiseResult = null
        this.promiseState = 'pending'
        this.callBack = []
        const self = this
        function resolve(data) {
            // console.log(self)
            if (self.promiseState!=='pending') {
                return
            }
            self.promiseResult = data
            self.promiseState = 'fulfilled'
            self.callBack.forEach(element => {
                element.onResolved()
            });
        }
        function reject(data) {
            if (self.promiseState!=='pending') {
                return
            }
            self.promiseResult = data
            self.promiseState = 'reject'
            self.callBack.forEach(element => {
                element.onRejected()
            });

        }
        try {
            executor(resolve,reject)
        } catch (error) {
            reject(error)
        }
    }
    //then方法
    then(onResolved,onRejected) {
        if (typeof onResolved !== 'function') {
            onResolved = value => value 
        }
        if (typeof onRejected !== 'function') {
            onRejected = reason => {throw reason} 
        }
        const self = this
        return new Promise((resolve,reject) => {
            if(this.promiseState==='fulfilled') {
                try {
                    let res = onResolved(this.promiseResult)
                    if(res instanceof Promise) {
                        res.then(v => {
                            resolve(v)
                        },r => {
                            reject(r)
                        })
                    }else {
                        resolve(res)
                    }
                } catch (error) {
                    reject(error)
                }
            }
            if(this.promiseState==='reject') {
                try {
                    let res = onRejected(this.promiseResult)
                    if(res instanceof Promise) {
                        res.then(v => {
                            resolve(v)
                        },r => {
                            reject(r)
                        })
                    }else {
                        resolve(res)
                    }
                } catch (error) {
                    reject(error)   
                }
            }   
            if(this.promiseState==='pending') {                
                this.callBack.push({
                    onResolved:() => {
                        try {
                            let res = onResolved(this.promiseResult)
                            if(res instanceof Promise) {
                                res.then(v => {
                                    resolve(v)
                                },r => {
                                    reject(r)
                                })
                            }else {
                                resolve(res)
                            }
                        } catch (error) {
                            reject(error)
                        }
                    },
                    onRejected: () => { 
                        try {
                            let res = onRejected(this.promiseResult)
                            if(res instanceof Promise) {
                                res.then(v => {
                                    resolve(v)
                                },r => {
                                    reject(r)
                                })
                            }else {
                                resolve(res)
                            }
                        } catch (error) {
                            reject(error)   
                        }
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