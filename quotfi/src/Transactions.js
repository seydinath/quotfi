import React, { useState, useEffect } from "react";
import "./App.css";

function Transactions({ transactions, onAddTransaction, onDeleteTransaction, token }) {
  // Liste d'actifs (matières premières en priorité)
  const assets = [
    "Or", "Argent", "Pétrole (Brent)", "Blé (Euronext)", "Cuivre",
    "EUR/USD", "USD/JPY", "GBP/USD", "BTC/USD", "ETH/USD", "Gold", "Silver", "Apple", "Tesla", "Amazon", "CAC 40", "S&P 500", "DAX 40", "Meta", "Google", "Solana", "Dogecoin", "Brent Oil", "USD/CHF", "USD/CAD"
  ];
  // Types de comptes courants dans le trading
  const accountTypes = [
    { value: "standard", label: "Compte Standard" },
    { value: "pro", label: "Compte Professionnel" },
    { value: "islamic", label: "Compte Islamique" },
    { value: "demo", label: "Compte Démo" },
    { value: "cent", label: "Compte Cent" },
    { value: "joint", label: "Compte Joint" },
    { value: "vip", label: "Compte VIP" }
  ];
  // Comptes utilisateur (état local)
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  // Formulaire d'ajout de compte (popup)
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: "", type: accountTypes[0].value });
  // Types d'action courants dans le trading
  const actions = [
    { value: "buy", label: "Achat (Buy)" },
    { value: "sell", label: "Vente (Sell)" },
    { value: "short", label: "Vente à découvert (Short)" },
    { value: "limit", label: "Ordre Limite (Limit)" },
    { value: "stop", label: "Ordre Stop (Stop)" }
  ];
  const [form, setForm] = useState({
    asset: assets[0],
    account: 1,
    action: actions[0].value,
    quantity: 1
  });
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === "quantity" ? Number(value) : value }));
  };
  // Met à jour le solde d'un compte dans le backend
  const updateAccountBalance = async (accountId, newBalance) => {
    try {
      await fetch(`http://localhost:5000/api/accounts/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ balance: newBalance })
      });
      setAccounts(accs => accs.map(a => a._id === accountId ? { ...a, balance: newBalance } : a));
    } catch (e) {}
  };
  // Correction : impact sur le solde du compte lors d'une transaction (API)
  const handleSubmit = async e => {
    e.preventDefault();
    const selectedAccount = accounts.find(a => a._id === form.account);
    if (!selectedAccount) return;
    const tx = {
      ...form,
      date: new Date().toLocaleString(),
      accountName: selectedAccount.name,
      actionLabel: actions.find(a => a.value === form.action).label
    };
    if (onAddTransaction) onAddTransaction(tx);
    // Impact sur le solde du compte
    let newBalance = selectedAccount.balance ?? 10000;
    if (form.action === "buy" || form.action === "limit" || form.action === "stop") {
      newBalance -= form.quantity * 100;
    } else if (form.action === "sell" || form.action === "short") {
      newBalance += form.quantity * 100;
    }
    await updateAccountBalance(selectedAccount._id, newBalance);
    setForm({ asset: assets[0], account: accounts[0]?._id, action: actions[0].value, quantity: 1 });
  };
  // Charger les comptes depuis l'API au montage
  useEffect(() => {
    async function fetchAccounts() {
      setLoadingAccounts(true);
      try {
        const res = await fetch("http://localhost:5000/api/accounts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Erreur API comptes");
        const data = await res.json();
        setAccounts(data);
      } catch (e) {
        setAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    }
    if (token) fetchAccounts();
  }, [token]);
  // Ajout d'un nouveau compte via API
  const handleAddAccount = async e => {
    e.preventDefault();
    if (!newAccount.name.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newAccount.name, type: newAccount.type })
      });
      if (!res.ok) throw new Error("Erreur création compte");
      const created = await res.json();
      setAccounts(accs => [...accs, created]);
      setShowAddAccount(false);
      setNewAccount({ name: "", type: accountTypes[0].value });
    } catch (e) {
      // Option: afficher une erreur
    }
  };
  // Suppression d'un compte via API
  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Supprimer ce compte ?')) return;
    try {
      await fetch(`http://localhost:5000/api/accounts/${accountId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(accs => accs.filter(a => a._id !== accountId));
    } catch (e) {
      // Option: afficher une erreur
    }
  };
  return (
    <section className="page-section transactions-section">
      <h2 className="transactions-title">Transactions</h2>
      <div className="accounts-management card accounts-management-grid">
        <h3 style={{color:'#4fd1c5',marginBottom:'1.2rem',fontSize:'1.18rem',gridColumn:'1/-1'}}>Mes comptes</h3>
        <ul className="accounts-list accounts-list-grid">
          {loadingAccounts ? (
            <li style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',minHeight:'60px'}}>
              <span className="spinner" style={{display:'inline-block',width:'32px',height:'32px',border:'4px solid #4fd1c5',borderTop:'4px solid #23272f',borderRadius:'50%',animation:'spin 1s linear infinite'}}></span>
              <span style={{marginLeft:'1rem',color:'#b5e3e8',fontStyle:'italic'}}>Chargement des comptes…</span>
            </li>
          ) : accounts.length === 0 ? (
            <li style={{color:'#b5e3e8',fontStyle:'italic'}}>Aucun compte enregistré.</li>
          ) : accounts.map(acc => (
            <li key={acc._id}>
              <div style={{display:'flex',flexDirection:'column',gap:'0.7rem',width:'100%'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
                  <strong style={{fontSize:'1.13rem',color:'#ffd700'}}>{acc.name}</strong>
                  <span className={`account-type-badge type-${acc.type}`}>{accountTypes.find(t=>t.value===acc.type)?.label}</span>
                  <button
                    className="cta-button"
                    style={{marginLeft:'auto',background:'#e53e3e',color:'#fff',padding:'0.2rem 0.7rem',fontSize:'0.98em',borderRadius:'0.7rem'}}
                    title="Supprimer le compte"
                    onClick={() => handleDeleteAccount(acc._id)}
                  >
                    Supprimer
                  </button>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'1.1rem',flexWrap:'wrap'}}>
                  <span style={{color:'#4fd1c5',fontWeight:600}}>Solde : {typeof acc.balance === 'number' ? acc.balance.toLocaleString() : '10,000'} €</span>
                  <span style={{color:'#b5e3e8',fontSize:'0.98em'}}>Type : {accountTypes.find(t=>t.value===acc.type)?.label}</span>
                  <span style={{color:'#b5e3e8',fontSize:'0.98em'}}>ID : {acc._id}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button className="cta-button" style={{marginTop:'0.7rem',gridColumn:'1/-1'}} onClick={()=>setShowAddAccount(true)}>Ajouter un compte</button>
      </div>
      {showAddAccount && (
        <div className="modal-overlay" onClick={()=>setShowAddAccount(false)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'#4fd1c5',marginBottom:'1.1rem'}}>Ajouter un compte</h3>
            <form className="add-account-form" onSubmit={handleAddAccount}>
              <label>
                <span>Nom du compte</span>
                <input type="text" placeholder="Nom du compte" value={newAccount.name} onChange={e=>setNewAccount(n=>({...n, name: e.target.value}))} required />
              </label>
              <label>
                <span>Type de compte</span>
                <select value={newAccount.type} onChange={e=>setNewAccount(n=>({...n, type: e.target.value}))}>
                  {accountTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit" className="cta-button">Ajouter</button>
                <button type="button" className="cta-button" style={{background:'#444',color:'#fff',marginLeft:'0.5rem'}} onClick={()=>setShowAddAccount(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <form className="transaction-form card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            <span>Actif</span>
            <select name="asset" value={form.asset} onChange={handleChange}>
              {assets.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
          <label>
            <span>Compte</span>
            <select name="account" value={form.account} onChange={handleChange}>
              {accounts.map(a => <option key={a._id} value={a._id}>{a.name} ({accountTypes.find(t=>t.value===a.type)?.label})</option>)}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>Type d'action</span>
            <select name="action" value={form.action} onChange={handleChange}>
              {actions.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </label>
          <label>
            <span>Quantité</span>
            <input type="number" name="quantity" min={1} value={form.quantity} onChange={handleChange} />
          </label>
        </div>
        <button type="submit" className="cta-button add-transaction-btn">Ajouter la transaction</button>
      </form>
      <div className="transactions-list card" style={{marginTop:'2.2rem',background:'#23272f',borderRadius:'1rem',boxShadow:'0 2px 12px #0007',padding:'2.2rem 1.7rem',border:'1px solid #333'}}>
        <h3 className="transactions-list-title" style={{marginBottom:'1.5rem',color:'#4fd1c5',fontSize:'1.18rem'}}>Historique des transactions</h3>
        {transactions.length === 0 ? <p className="empty-tx" style={{color:'#b5e3e8',fontStyle:'italic'}}>Aucune transaction enregistrée.</p> : (
          <table className="transactions-table" style={{background:'#181b20', borderRadius:'0.9rem', overflow:'hidden', fontSize:'1.13rem', borderCollapse:'separate', borderSpacing:'0 1.1rem', width:'100%'}}>
            <thead>
              <tr style={{background:'#23272f', color:'#b5e3e8', height:'3.2rem'}}>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left',borderRadius:'0.7rem 0 0 0.7rem'}}>Date</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left'}}>Actif</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left'}}>Type</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left'}}>Quantité</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left'}}>Compte</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left',borderRadius:'0 0.7rem 0.7rem 0'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} style={{background: i%2===0 ? '#23272f' : '#1a1d22', boxShadow:'0 1px 6px #0003', borderRadius:'0.7rem', marginBottom:'1.1rem', transition:'background 0.2s'}}>
                  <td style={{padding:'1.1rem 0.7rem', color:'#b5e3e8', fontWeight:600, borderRadius:'0.7rem 0 0 0.7rem'}}>{t.date}</td>
                  <td style={{padding:'1.1rem 0.7rem', color:'#ffd700', fontWeight:700}}>{t.asset}</td>
                  <td style={{padding:'1.1rem 0.7rem', color:'#4fd1c5', fontWeight:600}}>{t.actionLabel}</td>
                  <td style={{padding:'1.1rem 0.7rem', color:'#fff'}}>{t.quantity}</td>
                  <td style={{padding:'1.1rem 0.7rem', color:'#b5e3e8'}}>{t.accountName}</td>
                  <td style={{padding:'1.1rem 0.7rem', borderRadius:'0 0.7rem 0.7rem 0'}}>
                    <button className="cta-button" style={{padding:'0.3rem 0.9rem',fontWeight:700,fontSize:'1.05em',background:'#e53e3e',color:'#fff',borderRadius:'0.7rem'}}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Transactions;