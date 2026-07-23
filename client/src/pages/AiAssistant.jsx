import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import { Spinner } from "react-bootstrap";
import "./AiAssistant.css";
import ReactMarkdown from "react-markdown";

function AiAssistant() {
  const { user, token } = useAuth();
  
  // Chat state
  const [messages, setMessages] = useState([
    { sender: "model", text: `Hi ${user?.name.split(' ')[0] || 'there'}! I'm your Campus Compass AI. I can help you with admission queries, hostel info, finding faculty, or campus navigation. What do you need help with?` }
  ]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Recommendations state
  const [recommendations, setRecommendations] = useState(null);
  const [isRecLoading, setIsRecLoading] = useState(true);

  useEffect(() => {
    // Auto-scroll chat
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Fetch smart recommendations on load
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/ai/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ interests: user?.interests || "General activities" })
        });
        
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setIsRecLoading(false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    const newHistory = [...messages, { sender: "user", text: userMessage }];
    setMessages(newHistory);
    setIsChatLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages // pass history for context
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      
      setMessages([...newHistory, { sender: "model", text: data.reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages([...newHistory, { sender: "model", text: `Connection Error: ${error.message}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };
  return (
    <div className="container-fluid ai-dashboard d-flex flex-column flex-grow-1 position-relative" style={{ paddingTop: '120px' }}>
      <div className="row g-4 flex-grow-1 p-3">
        
        {/* LEFT PANEL: Smart Recommendations */}
        <div className="col-lg-5 animate-fade-in-up">
          <div className="glass-card h-100 d-flex flex-column p-4" style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(0, 240, 255, 0.05)' }}>
            <h3 className="fw-bold gradient-text mb-2" style={{fontFamily: 'Outfit'}}>✨ Smart Recommendations</h3>
            <p className="text-muted small mb-4">
              Curated specifically for you based on your interest: <span className="fw-bold" style={{color: 'var(--primary-accent)'}}>{user?.interests || "General"}</span>
            </p>

            <div className="recommendations-scroll flex-grow-1 pe-2">
              {isRecLoading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Spinner animation="grow" style={{color: 'var(--primary-accent)'}} />
                </div>
              ) : (
                <>
                  <h5 className="text-light fw-bold mb-3" style={{fontFamily: 'Outfit'}}><i className="bi bi-diagram-3-fill me-2" style={{color: 'var(--secondary-accent)'}}></i>Clubs for you</h5>
                  {recommendations?.clubs?.length > 0 ? (
                    recommendations.clubs.map((club, i) => (
                      <div key={i} className="rec-card club-rec mb-3 p-3 rounded-3 shadow-sm" style={{background: 'rgba(176, 38, 255, 0.1)', border: '1px solid rgba(176, 38, 255, 0.2)'}}>
                        <h6 className="fw-bold mb-1" style={{color: '#c4b5fd'}}>{club.name}</h6>
                        <p className="text-light small mb-0 opacity-75">{club.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small">No specific club matches found.</p>
                  )}

                  <h5 className="text-light fw-bold mb-3 mt-4" style={{fontFamily: 'Outfit'}}><i className="bi bi-calendar-event-fill me-2" style={{color: 'var(--tertiary-accent)'}}></i>Events for you</h5>
                  {recommendations?.events?.length > 0 ? (
                    recommendations.events.map((event, i) => (
                      <div key={i} className="rec-card event-rec mb-3 p-3 rounded-3 shadow-sm" style={{background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.2)'}}>
                        <h6 className="fw-bold mb-1" style={{color: '#ff85a1'}}>{event.title}</h6>
                        <p className="text-light small mb-0 opacity-75">{event.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small">No specific event matches found.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Chatbot */}
        <div className="col-lg-7 animate-fade-in-up delay-1">
          <div className="glass-card h-100 d-flex flex-column" style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(176, 38, 255, 0.05)' }}>
            {/* Chat Header */}
            <div className="chat-header p-3 border-bottom d-flex align-items-center" style={{borderColor: 'rgba(255,255,255,0.05) !important'}}>
              <div className="ai-avatar me-3" style={{background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--primary-accent)', borderRadius: '50%', padding: '10px', boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'}}>🤖</div>
              <div>
                <h5 className="mb-0 text-light fw-bold" style={{fontFamily: 'Outfit'}}>Campus Compass Assistant</h5>
                <small style={{color: 'var(--primary-accent)'}}>● Online</small>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages flex-grow-1 p-4 overflow-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`message-wrapper d-flex mb-4 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
                  {msg.sender === "model" && <div className="ai-avatar-small me-2 mt-auto" style={{fontSize: '1.2rem'}}>🤖</div>}
                  <div 
                    className={`message-bubble p-3 shadow-sm ${msg.sender === "user" ? "text-dark" : "text-light"}`}
                    style={{
                      background: msg.sender === "user" ? 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))' : 'rgba(15, 23, 42, 0.6)',
                      border: msg.sender === "user" ? 'none' : '1px solid var(--border-light)',
                      borderRadius: msg.sender === "user" ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      color: msg.sender === "user" ? '#000 !important' : '#fff'
                    }}
                  >
                    {msg.sender === "user" ? (
                      msg.text
                    ) : (
                      <div className="markdown-body text-light">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="message-wrapper d-flex mb-4 justify-content-start">
                  <div className="ai-avatar-small me-2 mt-auto">🤖</div>
                  <div className="message-bubble typing-indicator p-3" style={{background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-light)', borderRadius: '20px 20px 20px 4px'}}>
                    <span style={{background: 'var(--primary-accent)'}}></span><span style={{background: 'var(--primary-accent)'}}></span><span style={{background: 'var(--primary-accent)'}}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input p-3 border-top" style={{borderColor: 'rgba(255,255,255,0.05) !important', background: 'rgba(11, 14, 20, 0.4)'}}>
              <form onSubmit={handleSendMessage} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control text-light"
                  style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                  placeholder="Ask about admissions, hostel rules, or finding a faculty..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isChatLoading}
                />
                <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm" disabled={isChatLoading || !input.trim()}>
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default AiAssistant;
