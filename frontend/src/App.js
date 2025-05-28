import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Chat from './components/Chat';
import './App.css';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Register</Link> | <Link to="/login">Login</Link> | <Link to="/chat">Chat</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    );
}

export default App;
