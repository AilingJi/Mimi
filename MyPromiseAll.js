function myAll(promises) {
     // your code 
     return new Promise((resolve, reject) => { 
        const n = promises.length
        if (n === 0) resolve([])
        let cnt = 0
        let result = new Array(n)
        for(let i = 0; i < n; i++){ 
            Promise.resolve(promises[i]).then((res) => {
                result[i] = res
                cnt++
                if (cnt >= n) {
                    resolve(result)
                }
            }).catch(reject)
        } 
    }) 
}

// 1. 基本成功
// myAll([Promise.resolve(1), 2, Promise.resolve(3)])
//   .then(console.log) // [1,2,3]

// 2. 有一个 reject
// myAll([Promise.resolve(1), Promise.reject('err'), Promise.resolve(3)])
//   .then(() => console.log('should not hit'))
//   .catch(console.log) // 'err'

// 3. 空数组
// myAll([]).then(console.log); // []

// 4. thenable 对象
// const thenable = { then: (res) => res(42) };
// myAll([thenable, Promise.resolve(1)])
//   .then(console.log); // [42,1]

// 5. 顺序保证（慢速与快速）
function delay(val, t) {
  return new Promise(r => setTimeout(() => r(val), t));
}
myAll([delay(1, 100), delay(2, 10), delay(3, 50)])
  .then(console.log); // [1,2,3]