import { useState, useEffect } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiKey = "your api key"; // Replace "your_api_key" with your actual API key

  useEffect(() => {
    // Check if API key is provided
    if (!apiKey) {
      setError("Missing OpenAI API Key!");
    }
  }, []); // Empty dependency array to run only once on mount

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input) return; // Avoid sending empty messages

    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: input },
          ],
          model: "gpt-3.5-turbo", // Specify the model parameter
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      // Update messages state with user's message
      setMessages([
        ...messages,
        {
          role: "user",
          content: input,
        },
        // Update messages state with assistant's response
        {
          role: "assistant",
          content: response.data.choices[0].message.content,
        },
      ]);

      // Clear input field
      setInput("");
    } catch (error) {
      // Handle errors
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <div className="chat-container">
      {error && <div className="error">{error}</div>} {/* Display any errors */}
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="input-field"
        />
        <button onClick={handleSendMessage} className="send-button">
          {loading ? "Sending... please wait" : "Send"}{" "}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
