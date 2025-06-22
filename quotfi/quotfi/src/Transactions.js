import React, { useState } from "react";
import "./App.css";

function Transactions({ transactions, onAddTransaction, onDeleteTransaction }) {
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
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Compte principal", type: "standard" },
    { id: 2, name: "Compte trading", type: "pro" },
    { id: 3, name: "Compte épargne", type: "cent" }
  ]);
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
  // Correction : impact sur le solde du compte lors d'une transaction
  const handleSubmit = e => {
    e.preventDefault();
    const tx = {
      ...form,
      date: new Date().toLocaleString(),
      accountName: accounts.find(a => a.id === Number(form.account)).name,
      actionLabel: actions.find(a => a.value === form.action).label
    };
    if (onAddTransaction) onAddTransaction(tx);
    // Impact sur le solde du compte
    setAccounts(accs => accs.map(a => {
      if (a.id === Number(form.account)) {
        let newBalance = a.balance ?? 10000; // valeur par défaut si pas encore de balance
        // Définir l'impact selon le type d'action
        if (form.action === "buy" || form.action === "limit" || form.action === "stop") {
          newBalance -= form.quantity * 100; // exemple : chaque unité coûte 100€
        } else if (form.action === "sell" || form.action === "short") {
          newBalance += form.quantity * 100;
        }
        return { ...a, balance: newBalance };
      }
      return a;
    }));
    setForm({ asset: assets[0], account: accounts[0].id, action: actions[0].value, quantity: 1 });
  };
  // Ajout d'un nouveau compte
  const handleAddAccount = e => {
    e.preventDefault();
    if (!newAccount.name.trim()) return;
    setAccounts(accs => [
      ...accs,
      { id: Date.now(), name: newAccount.name, type: newAccount.type }
    ]);
    setShowAddAccount(false);
    setNewAccount({ name: "", type: accountTypes[0].value });
  };
  return (
    <section className="page-section transactions-section">
      <h2 className="transactions-title">Transactions</h2>
      <div className="accounts-management card">
        <h3>Mes comptes</h3>
        <ul className="accounts-list">
          {accounts.map(acc => (
            <li key={acc.id}>
              <strong>{acc.name}</strong> <span className={`account-type-badge type-${acc.type}`}>{accountTypes.find(t=>t.value===acc.type)?.label}</span>
              <span style={{marginLeft:'1rem',color:'#4fd1c5',fontWeight:600}}>
                Solde : {typeof acc.balance === 'number' ? acc.balance.toLocaleString() : '10,000'} €
              </span>
            </li>
          ))}
        </ul>
        <button className="cta-button" onClick={()=>setShowAddAccount(true)}>Ajouter un compte</button>
      </div>
      {showAddAccount && (
        <div className="modal-overlay" onClick={()=>setShowAddAccount(false)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3>Ajouter un compte</h3>
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
                <button type="button" className="cta-button" style={{background:'#444',marginLeft:'0.5rem'}} onClick={()=>setShowAddAccount(false)}>Annuler</button>
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
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({accountTypes.find(t=>t.value===a.type)?.label})</option>)}
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
      <div className="transactions-list card">
        <h3 className="transactions-list-title">Historique des transactions</h3>
        {transactions.length === 0 ? <p className="empty-tx">Aucune transaction enregistrée.</p> : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Actif</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Compte</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td>
                  <td>{t.asset}</td>
                  <td>{t.actionLabel}</td>
                  <td>{t.quantity}</td>
                  <td>{t.accountName}</td>
                  <td>
                    <button className="cta-button" onClick={() => onDeleteTransaction && onDeleteTransaction(i)}>
                      Supprimer
                    </button>
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