import { useState } from 'react';
function Child() {
  console.log("Child render");
  return <div>child</div>;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <Child />
    </>
  );
}
export default App;