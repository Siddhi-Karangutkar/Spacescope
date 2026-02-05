import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import './Chatbot.css';

const SYSTEM_RESPONSES = {
    default: "I am Cosmic AI. I can assist with space weather, mission data, and asteroid tracking. Ask me anything!",
    greetings: ["Greetings, Explorer!", "Systems online. How can I help?", "Ready for queries."],
    weather: "You can check the Cosmic Weather dashboard for real-time solar wind and K-Index data.",
    storm: "A geomagnetic storm (K-Index > 5) can disrupt GPS and radio communications.",
    asteroid: "Our Asteroid Radar tracks all NEOs. Currently, no imminent threats are detected.",
    mission: "Check the Missions dashboard for upcoming launches from NASA, SpaceX, and ISRO.",
    earth: "EarthLink monitors your local biosphere health using satellite telemetry."
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Greetings! I am your Cosmic Assistant. 🌌" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        const userMsg = { sender: 'user', text: userMessage };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch('http://localhost:5002/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-5) // Send last 5 messages for context
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessages(prev => [...prev, { sender: 'bot', text: data.text }]);
            } else {
                setMessages(prev => [...prev, { sender: 'bot', text: "Signal lost. Please retry your transmission." }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Systems offline. Connection to Command Center failed." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
            {/* Toggle Button */}
            {!isOpen && (
                <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
                    <Bot size={24} />
                    <span className="pulse-dot"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window glass-panel">
                    <header className="chat-header">
                        <div className="header-info">
                            <Sparkles size={18} className="text-cyan" />
                            <h3>Cosmic AI</h3>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    </header>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.sender}`}>
                                {msg.sender === 'bot' && <Bot size={16} className="bot-icon" />}
                                <div className="bubble">{msg.text}</div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot">
                                <Bot size={16} className="bot-icon" />
                                <div className="bubble typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Ask about space..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit">
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
