import React, {useState} from "react"

export default function TextInput() {
    const [text, setText] = useState('e')
    const handleChange = (e) => {
        if (!e || !e.target) return;
        setText(e.target.value)
    }
    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Please input..."
            />
            <p>Your content: {text}</p>
        </div>
    )
}