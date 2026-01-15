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
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // User Message
        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Simple Keyword Logic
        setTimeout(() => {
            let reply = SYSTEM_RESPONSES.default;
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes('hello') || lowerInput.includes('hi')) reply = SYSTEM_RESPONSES.greetings[Math.floor(Math.random() * 3)];
            else if (lowerInput.includes('weather') || lowerInput.includes('solar')) reply = SYSTEM_RESPONSES.weather;
            else if (lowerInput.includes('storm') || lowerInput.includes('danger')) reply = SYSTEM_RESPONSES.storm;
            else if (lowerInput.includes('asteroid') || lowerInput.includes('rock')) reply = SYSTEM_RESPONSES.asteroid;
            else if (lowerInput.includes('mission') || lowerInput.includes('launch')) reply = SYSTEM_RESPONSES.mission;
            else if (lowerInput.includes('earth') || lowerInput.includes('local')) reply = SYSTEM_RESPONSES.earth;

            setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        }, 600);
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
