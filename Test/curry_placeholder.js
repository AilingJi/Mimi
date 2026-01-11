

// This is a JavaScript coding problem from BFE.dev 

/**
 * @param { (...args: any[]) => any } fn
 * @returns { (...args: any[]) => any }
 */
function curry(fn) {
  // your code here
  const N = fn.length
  const holder = curry.placeholder

  function isEnd(arr) {
    if (arr.length < N) return false
    return arr.every(x => x !== holder && x !== undefined)
  }

  return function partFun(...args) {
    if (isEnd(args)) {
      return fn(...args)
    }
    return function(...remainArgs) {
      const newArgs = [...args]
      newArgs.length = N
      let i = 0
      for (const r of remainArgs) {
        while(i < N && newArgs[i] !== holder && newArgs[i] !== undefined) i++
        if (i < N) {
          newArgs[i] = r
          i++
        }
      }
      return partFun(...newArgs)
    }
  }
}
 
curry.placeholder = Symbol()

const  join = (a, b, c) => {
  return `${a}_${b}_${c}`
}

const curriedJoin = curry(join)
const _ = curry.placeholder
console.log(curriedJoin(1)(2)(3)) // '1_2_3'
console.log(curriedJoin(1, 2, 3)) // '1_2_3'
console.log(curriedJoin(_, 2)(1, 3)) // '1_2_3'
console.log(curriedJoin(_, _, _)(1)(_, 3)(2)) // '1_2_3'
console.log(curriedJoin(_,_,_,_)(_,2,_)(_,3)(1)) // '1_2_3'
console.log(curriedJoin(1)(_,3)(2)) // '1_2_3'

const curried = curry(join)(1, 2)
curried(3)
console.log(curried(4))// '1_2_4'
