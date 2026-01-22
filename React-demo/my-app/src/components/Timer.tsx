import React, { useState, useEffect } from "react";

export default function Timer() {
    const [count, setCount] = useState(0)
    useEffect(() => {
        const timer = setInterval(() => {
            setCount((c) => c + 1)
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, []);
    return (
        <div>
            Counter: {count}
        </div>
    )
}