console.log('A');

setTimeout(() => {
  console.log('B');

  Promise.resolve().then(() => {
    console.log('C');
  });

  setTimeout(() => {
    console.log('D');
  }, 0);

}, 0);

Promise.resolve().then(() => {
  console.log('E');

  setTimeout(() => {
    console.log('F');
  }, 0);

  Promise.resolve().then(() => {
    console.log('G');
  });

});

console.log('H');
// A H E G B C F D
