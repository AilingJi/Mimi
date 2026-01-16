import React, {useState} from "react"
export default function Counter () {
    const [count, setCount] = useState(0)
    return (
        <div style={{marginTop: 25}}>
            <h2>Counter: {count} </h2>

            <button 
                onClick={() => setCount(count+1)}
                style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontSize: 16,
                    cursor: "pointer"
                }}
            >Add one</button>
        </div>
    )
}