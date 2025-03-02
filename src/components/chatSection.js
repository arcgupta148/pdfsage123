import { useState } from "react";

const ChatSection = ({ documentId }) => {
  const [chatMessages, setChatMessages] = useState([
    { role: "bot", text: "Start asking insights about the PDF" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to chat
    const newMessage = { role: "user", text: userInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      // Construct API URL with query parameters
      const response = await fetch(
        `http://localhost:8001/files/query?document_id=${documentId}&query=${(userInput)}`,{
        "method":"POST",
        "mode":"cors"
      }
      );
      const data = await response.json();
      const extractedText = data.objects[0].properties?.text || "No relevant information found.";
      console.log("Extracted text is ",extractedText)
      // Add bot's response to chat
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", text: extractedText }
      ]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error retrieving response. Please try again." }
      ]);
    } finally {
      setLoading(false);
      setUserInput(""); // Clear input field
    }
  };

  return (
    <div className="chat-section">
      <div className="chat-messages">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Fetching insights...</div>}
      </div>

      <form onSubmit={handleChatSubmit} className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your query..."
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatSection;
