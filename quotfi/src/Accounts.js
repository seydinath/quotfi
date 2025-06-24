import React, { useState, useEffect } from "react";
import "./App.css";

function Accounts() {
  // Récupère les infos utilisateur depuis localStorage si dispo
  const defaultUser = {
    name: "Jean Dupont",
    iban: "FR76 3000 6000 0112 3456 7890 189",
    bic: "AGRIFRPP",
    address: "12 rue de la Bourse, 75002 Paris, France",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    accountType: "standard"
  };
  const [user, setUser] = useState(defaultUser);

  useEffect(() => {
    const stored = localStorage.getItem('quotfi_user_account');
    if (stored) {
      const u = JSON.parse(stored);
      setUser({
        name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : defaultUser.name,
        iban: u.iban || defaultUser.iban,
        bic: u.bic || defaultUser.bic,
        address: u.address || defaultUser.address,
        email: u.email || defaultUser.email,
        phone: u.phone || defaultUser.phone,
        accountType: u.accountType || defaultUser.accountType
      });
    }
  }, []);
  // Soldes et fonds
  const [balance, setBalance] = useState(12500);
  const [pending, setPending] = useState(1200);
  // Mouvements (crédit/débit)
  const movements = [
    { date: "2025-06-18", type: "credit", label: "Virement reçu", amount: 2000 },
    { date: "2025-06-17", type: "debit", label: "Achat Apple", amount: -1500 },
    { date: "2025-06-16", type: "debit", label: "Achat BTC/USD", amount: -800 },
    { date: "2025-06-15", type: "credit", label: "Vente Tesla", amount: 1200 },
    { date: "2025-06-14", type: "debit", label: "Retrait", amount: -500 }
  ];
  // Opérations en cours
  const pendingOps = [
    { date: "2025-06-20", label: "Achat EUR/USD", amount: -1000 },
    { date: "2025-06-20", label: "Virement sortant", amount: -200 }
  ];
  // Transactions clôturées
  const closedTx = [
    { date: "2025-06-10", label: "Achat Gold", amount: -700 },
    { date: "2025-06-09", label: "Vente S&P 500", amount: 900 }
  ];
  // Totaux mouvements
  const totalCredit = movements.filter(m => m.type === "credit").reduce((a, m) => a + m.amount, 0);
  const totalDebit = movements.filter(m => m.type === "debit").reduce((a, m) => a + Math.abs(m.amount), 0);
  const totalMovements = movements.length;

  return (
    <section className="page-section accounts-section">
      <h2 className="accounts-title">Mon Compte</h2>
      <div className="accounts-main-grid">
        <div className="accounts-details card accounts-grid-item">
          <h3 style={{color:'#4fd1c5',marginBottom:'1.1rem'}}>Détails bancaires</h3>
          <ul className="account-info-list">
            <li><strong>Nom :</strong> {user.name}</li>
            <li><strong>IBAN :</strong> {user.iban}</li>
            <li><strong>BIC :</strong> {user.bic}</li>
            <li><strong>Adresse :</strong> {user.address}</li>
            <li><strong>Email :</strong> {user.email}</li>
            <li><strong>Téléphone :</strong> {user.phone}</li>
          </ul>
        </div>
        <div className="accounts-funds card accounts-grid-item">
          <h3 style={{color:'#ffd700',marginBottom:'1.1rem'}}>Fonds & Soldes</h3>
          <ul className="funds-list">
            <li><strong>Solde actuel :</strong> <span className="funds-badge">{balance.toLocaleString()} €</span></li>
            <li><strong>Solde provisoire :</strong> <span className="funds-badge pending">{(balance - pending).toLocaleString()} €</span></li>
            <li><strong>Fonds en attente :</strong> <span className="funds-badge waiting">{pending.toLocaleString()} €</span></li>
          </ul>
        </div>
        <div className="accounts-movements card accounts-grid-item">
          <h3 style={{color:'#4fd1c5',marginBottom:'1.1rem'}}>Mouvements du compte</h3>
          <table className="movements-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Libellé</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m, i) => (
                <tr key={i}>
                  <td>{m.date}</td>
                  <td>{m.label}</td>
                  <td className={m.type === "credit" ? "credit" : "debit"}>{m.amount > 0 ? "+" : ""}{m.amount} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="accounts-movements-summary card accounts-grid-item">
          <h3 style={{color:'#ffd700',marginBottom:'1.1rem'}}>Résumé mouvements</h3>
          <ul className="movements-summary-list">
            <li><strong>Total crédits :</strong> <span className="credit">{totalCredit} €</span></li>
            <li><strong>Total débits :</strong> <span className="debit">{totalDebit} €</span></li>
            <li><strong>Nombre de mouvements :</strong> {totalMovements}</li>
          </ul>
        </div>
        <div className="accounts-pending card accounts-grid-item">
          <h3 style={{color:'#4fd1c5',marginBottom:'1.1rem'}}>Opérations en cours</h3>
          <ul className="pending-list">
            {pendingOps.map((op, i) => (
              <li key={i}><span>{op.date}</span> — {op.label} <span className="debit">{op.amount} €</span></li>
            ))}
          </ul>
        </div>
        <div className="accounts-closed card accounts-grid-item">
          <h3 style={{color:'#ffd700',marginBottom:'1.1rem'}}>Transactions clôturées</h3>
          <ul className="closed-list">
            {closedTx.map((tx, i) => (
              <li key={i}><span>{tx.date}</span> — {tx.label} <span className={tx.amount > 0 ? "credit" : "debit"}>{tx.amount > 0 ? "+" : ""}{tx.amount} €</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Accounts;
