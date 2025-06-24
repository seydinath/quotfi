import React, { useState } from "react";
import "./App.css";
import logo from './logo.svg';

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    // Accès démo par défaut
    if (email === "demo@demo.com" && password === "demodemo123") {
      setError("");
      onLogin({
        email: "demo@demo.com",
        firstName: "Démo",
        lastName: "Utilisateur",
        accountType: "standard",
        iban: "DEMOIBAN000000",
        phone: "0000000000"
      });
      return;
    }
    setError("Identifiants invalides (utilisez demo@demo.com / demodemo123 pour l'accès démo)");
  };

  return (
    <div className="login-card card">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
        <img src={logo} alt="Quotfi Logo" style={{ width: 64, height: 64, marginBottom: '0.5rem', filter: 'drop-shadow(0 0 8px #ffd70088)' }} />
        <span style={{ fontWeight: 700, fontSize: '1.5rem', color: '#ffd700', letterSpacing: 1 }}>Quotfi</span>
      </div>
      <form onSubmit={handleSubmit} className="login-form" style={{boxShadow:'none',background:'none',padding:0}}>
        <label>
          Adresse e-mail
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="cta-button" style={{marginTop:'1rem'}}>Se connecter</button>
        <div className="login-footer">
          <span>Pas encore de compte ? </span>
          <button className="link-button" type="button" onClick={onShowRegister}>Créer un compte</button>
        </div>
        <div className="login-footer" style={{marginTop:'0.7rem',fontSize:'0.98rem',color:'#b0b6c3'}}>
          <span>Accès démo : demo@demo.com / demodemo123</span>
        </div>
      </form>
    </div>
  );
}

function Register({ onRegister, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    firstName: "",
    lastName: "",
    accountType: "standard",
    iban: "",
    phone: "",
    address: "",
    bic: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = e => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleRegister = e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.iban || !form.phone || !form.address || !form.bic) {
      setError("Veuillez remplir tous les champs du compte.");
      return;
    }
    setError("");
    setSuccess(true);
    setTimeout(() => {
      onRegister({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        accountType: form.accountType,
        iban: form.iban,
        phone: form.phone,
        address: form.address,
        bic: form.bic
      });
    }, 2000);
  };

  return success ? (
    <div className="register-success">
      <p>Un e-mail de confirmation a été envoyé à <strong>{form.email}</strong>.<br/>Veuillez vérifier votre boîte de réception.</p>
    </div>
  ) : (
    <div className="login-card card">
      <form onSubmit={step===1 ? handleNext : handleRegister} className="login-form" style={{boxShadow:'none',background:'none',padding:0}}>
        {step === 1 && (
          <>
            <label>
              Adresse e-mail
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </label>
            <label>
              Mot de passe
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Confirmer le mot de passe
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}
        {step === 2 && (
          <>
            <label style={{ color: '#4fd1c5', fontWeight: 600 }}>
              Prénom
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                style={{
                  background: '#181b20', color: '#fff', border: '1.5px solid #38b2ac', borderRadius: '0.5rem', padding: '0.7rem 1rem', fontSize: '1.05rem', marginTop: '0.4rem'
                }}
              />
            </label>
            <label style={{ color: '#4fd1c5', fontWeight: 600 }}>
              Nom
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                style={{
                  background: '#181b20', color: '#fff', border: '1.5px solid #38b2ac', borderRadius: '0.5rem', padding: '0.7rem 1rem', fontSize: '1.05rem', marginTop: '0.4rem'
                }}
              />
            </label>
            <label style={{ color: '#4fd1c5', fontWeight: 600 }}>
              Type de compte
              <select name="accountType" value={form.accountType} onChange={handleChange} required
                style={{
                  background: '#181b20', color: '#fff', border: '1.5px solid #38b2ac', borderRadius: '0.5rem', padding: '0.7rem 1rem', fontSize: '1.05rem', marginTop: '0.4rem'
                }}
              >
                <option value="standard">Standard</option>
                <option value="pro">Pro</option>
                <option value="islamique">Islamique</option>
                <option value="démo">Démo</option>
                <option value="cent">Cent</option>
                <option value="joint">Joint</option>
                <option value="vip">VIP</option>
              </select>
            </label>
            <label style={{ color: '#4fd1c5', fontWeight: 600 }}>
              IBAN
              <input
                type="text"
                name="iban"
                value={form.iban}
                onChange={handleChange}
                required
                style={{
                  background: '#181b20', color: '#fff', border: '1.5px solid #38b2ac', borderRadius: '0.5rem', padding: '0.7rem 1rem', fontSize: '1.05rem', marginTop: '0.4rem'
                }}
              />
            </label>
            <label style={{ color: '#4fd1c5', fontWeight: 600 }}>
              Téléphone
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                style={{
                  background: '#181b20', color: '#fff', border: '1.5px solid #38b2ac', borderRadius: '0.5rem', padding: '0.7rem 1rem', fontSize: '1.05rem', marginTop: '0.4rem'
                }}
              />
            </label>
            <label style={{ color: '#4fd1c5', fontWeight: 600 }}>
              Adresse
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                style={{
                  background: '#181b20', color: '#fff', border: '1.5px solid #38b2ac', borderRadius: '0.5rem', padding: '0.7rem 1rem', fontSize: '1.05rem', marginTop: '0.4rem'
                }}
              />
            </label>
            <label style={{ color: '#4fd1c5', fontWeight: 600 }}>
              BIC
              <input
                type="text"
                name="bic"
                value={form.bic}
                onChange={handleChange}
                required
                style={{
                  background: '#181b20', color: '#fff', border: '1.5px solid #38b2ac', borderRadius: '0.5rem', padding: '0.7rem 1rem', fontSize: '1.05rem', marginTop: '0.4rem'
                }}
              />
            </label>
          </>
        )}
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="cta-button" style={{marginTop:'1rem'}}>
          {step === 1 ? "Suivant" : "Créer mon compte"}
        </button>
        <div className="login-footer">
          <button className="link-button" type="button" onClick={onBack}>Retour</button>
        </div>
      </form>
    </div>
  );
}

export { Login, Register };
