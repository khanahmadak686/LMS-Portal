import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Send, MessageCircle, Info } from 'lucide-react';

// ⚠️ Note for Deployment: Jab Render par live karein, toh 'https://lms-backend-api-ybnd.onrender.com' ki jagah apna Render URL daalein
const socket = io('https://lms-backend-api-ybnd.onrender.com'); 

const CourseDiscussion = ({ courseId, user }) => {
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');
  const chatEndRef = useRef(null);

  // 1. Load history & Join socket room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.get(`https://lms-backend-api-ybnd.onrender.com/api/messages/${courseId}`, config);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    if (user?.token) {
      fetchMessages();
      socket.emit('join_course', courseId);
    }
  }, [courseId, user]);

  // 2. Listen for incoming live messages
  useEffect(() => {
    const receiveMessageHandler = (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    };
    
    socket.on('receive_message', receiveMessageHandler);
    return () => socket.off('receive_message', receiveMessageHandler);
  }, []);

  // 3. Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Send Message Function
  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMsg.trim() === '') return;

    const messageData = {
      courseId,
      sender: user._id, // Fixed: Backend expects 'sender', not 'senderId'
      senderName: user.name,
      text: currentMsg,
      createdAt: new Date().toISOString() // Local time for instant feedback
    };

    socket.emit('send_message', messageData); 
    setCurrentMsg(''); 
  };

  // Helper function to generate Avatar Initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div style={{ 
      background: 'var(--white)', 
      padding: '2rem', 
      borderRadius: '1rem', 
      marginTop: '2rem', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
      border: '1px solid #e5e7eb' 
    }}>
      
      {/* 🟢 HEADER */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div style={{ background: '#e0e7ff', padding: '0.6rem', borderRadius: '0.5rem', display: 'flex' }}>
          <MessageCircle size={24} color="var(--primary-color)" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>Live Q&A Forum</h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ask doubts, share ideas, and discuss with the instructor and peers.
          </p>
        </div>
      </div>
      
      {/* 🟢 CHAT HISTORY BOX */}
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        background: '#f8fafc', // Soft modern background
        padding: '1.5rem', 
        borderRadius: '0.75rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.2rem',
        border: '1px solid #e2e8f0'
      }}>
        
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            <Info size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }}/>
            <p style={{ margin: 0, fontWeight: '500' }}>No discussions yet.</p>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem' }}>Be the first to ask a question!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === user._id;
            
            return (
              <div key={index} style={{ 
                alignSelf: isMe ? 'flex-end' : 'flex-start', 
                maxWidth: '80%',
                display: 'flex',
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '0.5rem'
              }}>
                
                {/* Avatar Icon */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: isMe ? 'var(--primary-color)' : '#94a3b8',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 'bold'
                }}>
                  {getInitials(msg.senderName)}
                </div>

                {/* Message Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>
                    {isMe ? 'You' : msg.senderName}
                  </span>
                  
                  <div style={{ 
                    background: isMe ? 'var(--primary-color)' : 'white', 
                    color: isMe ? 'white' : '#1e293b', 
                    padding: '0.8rem 1.2rem', 
                    borderRadius: '1rem', 
                    borderBottomRightRadius: isMe ? '0' : '1rem', 
                    borderBottomLeftRadius: !isMe ? '0' : '1rem', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    border: isMe ? 'none' : '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                </div>

              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 🟢 MESSAGE INPUT FORM */}
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Ask a doubt or answer a question..." 
          className="form-control" 
          style={{ 
            flex: 1, 
            margin: 0, 
            borderRadius: '50px', 
            padding: '1rem 1.5rem',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s',
            outline: 'none'
          }} 
          value={currentMsg} 
          onChange={(e) => setCurrentMsg(e.target.value)}
          onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.backgroundColor = 'white'; }}
          onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
        />
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ 
            borderRadius: '50%', 
            width: '52px', 
            height: '52px', 
            padding: '0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          disabled={currentMsg.trim() === ''}
        >
          <Send size={20} style={{ marginLeft: '-2px' }} />
        </button>
      </form>
      
    </div>
  );
};

export default CourseDiscussion;