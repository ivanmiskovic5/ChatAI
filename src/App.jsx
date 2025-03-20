import { useEffect, useRef, useState } from "react"
import ChatbotIcon from "./components/Chatboticon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"

const App =() => {
  const[chatHistory, setChatHistory] = useState([])
  const[showChatbot, setShowChatbot] = useState([false])
  const chatBodyRef = useRef()

  const generateBotResponse = async (history) => {
      // Updating answer to our question after loading
      const updateHistory = (text, isError = false) =>{
        setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text, isError}])
      }
      // Formating chat on API request
      history = history.map(({role, text}) => ({role, parts: [{text}]}))

      const requestOptions = {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({contents: history})
      }

      // Calling API for response
      try {
        const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
        const data = await response.json()
        if(!response.ok) throw new Error(data.error.message || "Something went wrong!!")

        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
        updateHistory(apiResponseText)
      } catch (error)  {
        updateHistory(error.message, true)
      }
  }

  useEffect(() => {
    // Automatic scrolling with each new message
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behaviour: "smooth"})
  }, [chatHistory])

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment
        </span>
        <span className="material-symbols-rounded">close
        </span>
      </button>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">ChatAi</h2>
          </div>
          <button onClick={() => setShowChatbot(prev => !prev)}
          className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon/>
            <p className="message-text">
              Hey there! <br/> How can i help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat}/>
          ))}
        </div>
        <div className="chat-footer">
          <ChatForm chatHistory ={chatHistory} setChatHistory={setChatHistory} generateBotResponse = {generateBotResponse}/>
        </div>
      </div>
    </div>
  )
}

export default App