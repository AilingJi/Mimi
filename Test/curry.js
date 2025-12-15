

// This is a JavaScript coding problem from BFE.dev 

/**
 * @param { (...args: any[]) => any } fn
 * @returns { (...args: any[]) => any }
 */
function curry(fn) {
    // your code here
    return function partyCurry(...args) {
      if (args.length >= fn.length) {
        return fn(...args.slice(0, fn.length))
      }
      return function (...remain) {
        return partyCurry(...args, ...remain)
      }
    }
  }
  
  const join = (a, b, c) => {
     return `${a}_${b}_${c}`
  }
  const curriedJoin = curry(join)
  console.log(curriedJoin(1, 2, 3)) // '1_2_3'
  console.log(curriedJoin(1)(2, 3)) // '1_2_3'
  console.log(curriedJoin(1, 2)(3)) // '1_2_3'
  console.log(curriedJoin(1)(2)(3)) // '1_2_3'
  console.log(curriedJoin(1, 2, 3, 4)) // '1_2_3'
  