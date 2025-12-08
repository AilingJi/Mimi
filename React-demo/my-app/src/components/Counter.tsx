import React, {useState} from "react"
export default function Counter () {
    const [count, setCount] = useState(0)
    return (
        <div style={{marginTop: 25}}>
            <h2>计数器: {count} </h2>

            <button 
                onClick={() => setCount(count+1)}
                style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontSize: 16,
                    cursor: "pointer"
                }}
            >加一</button>
        </div>
    )
}