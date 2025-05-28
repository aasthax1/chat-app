import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://192.168.29.46:5001'); // replace with backend machine IP

function Chat() {
    const [username, setUsername] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on('update_users', (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('receive_message');
            socket.off('update_users');
        };
    }, []);

    const handleJoin = () => {
        if (username.trim() === '') return;
        socket.emit('join', username);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;
        socket.emit('send_message', { text: input });
        setInput('');
    };

    if (!username) {
        return (
            <div>
                <h2>Enter Your Username</h2>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <button onClick={handleJoin}>Join Chat</button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 3 }}>
                <h2>Chat Room</h2>
                <div style={{ border: '1px solid gray', height: '300px', overflowY: 'scroll', padding: '10px' }}>
                    {messages.map((msg, index) => (
                        <p key={index}><strong>{msg.username}:</strong> {msg.text}</p>
                    ))}
                </div>
                <form onSubmit={sendMessage}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        required
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
            <div style={{ flex: 1 }}>
                <h3>Online Users</h3>
                <ul>
                    {onlineUsers.map((user, idx) => (
                        <li key={idx}>{user}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Chat;
