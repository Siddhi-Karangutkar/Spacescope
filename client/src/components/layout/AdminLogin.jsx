import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (password === 'admin') {
            onClose(); // Close modal
            // Save valid session briefly to allow access mostly
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin'); // Redirect to central admin portal
        } else {
            setError('Access Denied: Invalid Credentials');
            setPassword('');
        }
    };

    return (
        <div className="admin-login-overlay">
            <div className="admin-login-card">
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="admin-icon">
                    <Lock size={32} />
                </div>

                <div className="login-header">
                    <h2>Admin Access</h2>
                    <p>Restricted Area. Authorized Personnel Only.</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-input-group">
                        <label>Password Code</label>
                        <input
                            type="password"
                            className="admin-input"
                            placeholder="Enter Security Key"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            autoFocus
                        />
                        {error && <span className="error-msg">{error}</span>}
                    </div>

                    <button type="submit" className="login-btn" style={{ marginTop: '1.5rem', width: '100%' }}>
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
