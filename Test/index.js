const str = "Hello, Frontend!";
console.log(str.length)
console.log(str.slice(7));        // "Frontend!" (from index 7 to end)
console.log(str.slice(7, 12));    // "Front" (7 to 11, end=12 is excluded)
console.log(str.slice(-7, -1));  // "ontend" (-7 = index 9, -1 = index 15)
console.log(str.slice(12, 7)); // ""