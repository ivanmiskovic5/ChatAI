import { useRef } from "react"

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef()

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const userMessage =inputRef.current.value.trim()
        if (!userMessage) return
        inputRef.current.value = ""


        // Update history of chat with users message
        setChatHistory(history => [...history, {role: "user", text: userMessage}])

        // Adding message that bot is "Thinking..."
        setTimeout(() => {
            
            setChatHistory((history) => [...history, {role: "model", text: "Thinking..."}])
        
            generateBotResponse([...chatHistory, {role: "user", text: userMessage} ])}, 600)
    }

    return(
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="What do you wanna know?" 
            className="message-input" required />
            <button className="material-symbols-rounded">arrow_upward</button>
        </form>
    )
}

export default ChatForm
