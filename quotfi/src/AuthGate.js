import React, { useState } from "react";
import { Login, Register } from "./Login";
import "./App.css";

function AuthGate({ onAuth }) {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({});

  // Handler pour login
  const handleLogin = email => {
    setUser({ email });
    setShowRegister(false);
    onAuth({ email });
  };

  // Handler pour register (avec infos Mon Compte)
  const handleRegister = data => {
    setUser(data);
    setShowRegister(false);
    onAuth(data);
  };

  return (
    <div className="authgate-outer">
      <div className="authgate-center card">
        <div className="authgate-logo">
          <span className="logo-large">QuotFi</span>
        </div>
        {!user && (showRegister ? (
          <Register onRegister={handleRegister} onBack={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />
        ))}
      </div>
    </div>
  );
}

export default AuthGate;
