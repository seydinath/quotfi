import React, { useState } from "react";
import Markets from "./Markets";
import Transactions from "./Transactions";
import Accounts from "./Accounts";
import { Login, Register } from "./Login";
import AuthGate from "./AuthGate";
import "./App.css";
import Couverture from "./Couverture";

function Dashboard({ transactions, couvertures, calculerExpositionNette, hasActiveHedge, choisirMeilleureCouverture }) {
  // Calcul exposition nette
  const expositionNette = calculerExpositionNette(transactions, couvertures);
  // Liste des actifs à surveiller (ceux présents dans les transactions)
  const actifs = Object.keys(expositionNette);
  // Alertes pour actifs sans couverture
  const alertes = actifs.filter(a => expositionNette[a] > 0 && !hasActiveHedge(couvertures, a));

  // Exemple d'options de couverture pour la démo (à remplacer par des vraies données si besoin)
  const optionsDemo = [
    { type: 'futures', efficacite: 0.95, cout: 2, volatilite: 1 },
    { type: 'swap', efficacite: 0.85, cout: 1, volatilite: 0.7 }
  ];
  const meilleure = choisirMeilleureCouverture(optionsDemo, 'modéré');

  return (
    <section className="dashboard">
      <h2>Tableau de bord</h2>
      <div className="dashboard-grid">
        <div className="dashboard-main-left">
          <div className="dashboard-cards" style={{ marginBottom: "1.5rem" }}>
            {/* Matières premières existantes */}
            <div className="dashboard-card">
              <h3>Or</h3>
              <p>
                Lingot 1kg :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +0.45%
                </span>
              </p>
              <p>
                Lingot 100g :{" "}
                <span className="down" style={{ color: "#e53e3e" }}>
                  -0.12%
                </span>
              </p>
            </div>
            <div className="dashboard-card">
              <h3>Argent</h3>
              <p>
                Once :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +1.10%
                </span>
              </p>
              <p>
                Lingot 1kg :{" "}
                <span className="down" style={{ color: "#e53e3e" }}>
                  -0.45%
                </span>
              </p>
            </div>
            <div className="dashboard-card">
              <h3>Pétrole</h3>
              <p>
                Brent :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +2.30%
                </span>
              </p>
              <p>
                WTI :{" "}
                <span className="down" style={{ color: "#e53e3e" }}>
                  -0.80%
                </span>
              </p>
            </div>
            <div className="dashboard-card">
              <h3>Blé</h3>
              <p>
                Euronext :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +0.15%
                </span>
              </p>
              <p>
                CBOT :{" "}
                <span className="down" style={{ color: "#e53e3e" }}>
                  -0.22%
                </span>
              </p>
            </div>
            {/* --- NOUVEAUX AJOUTS --- */}
            <div className="dashboard-card">
              <h3>Fonds communs</h3>
              <p>
                Carmignac Patrimoine :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>+0.62%</span>
              </p>
              <p>
                Amundi MSCI World :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>+1.05%</span>
              </p>
              <p>
                BNP Paribas Euro :{" "}
                <span className="down" style={{ color: "#e53e3e" }}>-0.18%</span>
              </p>
            </div>
            <div className="dashboard-card">
              <h3>Indices internationaux</h3>
              <p>
                S&P 500 :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>+0.90%</span>
              </p>
              <p>
                Nikkei 225 :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>+1.25%</span>
              </p>
              <p>
                DAX :{" "}
                <span className="down" style={{ color: "#e53e3e" }}>-0.35%</span>
              </p>
              <p>
                CAC 40 :{" "}
                <span className="up" style={{ color: "#38b2ac" }}>+0.42%</span>
              </p>
            </div>
            <div className="dashboard-card">
              <h3>Risque pays</h3>
              <p>
                France : <span style={{ color: "#38b2ac", fontWeight:600 }}>Faible</span>
              </p>
              <p>
                Brésil : <span style={{ color: "#ffd700", fontWeight:600 }}>Modéré</span>
              </p>
              <p>
                Chine : <span style={{ color: "#ffd700", fontWeight:600 }}>Modéré</span>
              </p>
              <p>
                Turquie : <span style={{ color: "#e53e3e", fontWeight:600 }}>Élevé</span>
              </p>
            </div>
          </div>
          <div className="dashboard-summary" style={{ marginBottom: "1.5rem" }}>
            <h4>Résumé du marché</h4>
            <p>
              Les marchés sont globalement stables aujourd’hui, avec une légère
              hausse des cryptomonnaies et des indices européens.
            </p>
          </div>
          <div className="dashboard-cac40-graph" style={{ marginBottom: "1.5rem" }}>
            <h4>Évolution du CAC 40 (exemple technique)</h4>
            <svg viewBox="0 0 320 90" className="cac40-graph">
              {/* Candlestick 1 */}
              <rect x="10" y="40" width="10" height="30" fill="#e53e3e" rx="2" />
              <rect x="13" y="30" width="4" height="20" fill="#e53e3e" />
              {/* Candlestick 2 */}
              <rect x="35" y="35" width="10" height="35" fill="#38b2ac" rx="2" />
              <rect x="38" y="25" width="4" height="20" fill="#38b2ac" />
              {/* Candlestick 3 */}
              <rect x="60" y="50" width="10" height="20" fill="#e53e3e" rx="2" />
              <rect x="63" y="40" width="4" height="15" fill="#e53e3e" />
              {/* Candlestick 4 */}
              <rect x="85" y="30" width="10" height="40" fill="#38b2ac" rx="2" />
              <rect x="88" y="20" width="4" height="25" fill="#38b2ac" />
              {/* Candlestick 5 */}
              <rect x="110" y="45" width="10" height="25" fill="#e53e3e" rx="2" />
              <rect x="113" y="35" width="4" height="15" fill="#e53e3e" />
              {/* Candlestick 6 */}
              <rect x="135" y="25" width="10" height="45" fill="#38b2ac" rx="2" />
              <rect x="138" y="15" width="4" height="25" fill="#38b2ac" />
              {/* Candlestick 7 */}
              <rect x="160" y="40" width="10" height="30" fill="#e53e3e" rx="2" />
              <rect x="163" y="30" width="4" height="20" fill="#e53e3e" />
              {/* Candlestick 8 */}
              <rect x="185" y="35" width="10" height="35" fill="#38b2ac" rx="2" />
              <rect x="188" y="25" width="4" height="20" fill="#38b2ac" />
              {/* Candlestick 9 */}
              <rect x="210" y="50" width="10" height="20" fill="#e53e3e" rx="2" />
              <rect x="213" y="40" width="4" height="15" fill="#e53e3e" />
              {/* Candlestick 10 */}
              <rect x="235" y="30" width="10" height="40" fill="#38b2ac" rx="2" />
              <rect x="238" y="20" width="4" height="25" fill="#38b2ac" />
              {/* Candlestick 11 */}
              <rect x="260" y="45" width="10" height="25" fill="#e53e3e" rx="2" />
              <rect x="263" y="35" width="4" height="15" fill="#e53e3e" />
              {/* Candlestick 12 */}
              <rect x="285" y="25" width="10" height="45" fill="#38b2ac" rx="2" />
              <rect x="288" y="15" width="4" height="25" fill="#38b2ac" />
            </svg>
            <div className="cac40-graph-labels">
              <span>10h</span>
              <span>11h</span>
              <span>12h</span>
              <span>13h</span>
              <span>14h</span>
              <span>15h</span>
              <span>16h</span>
            </div>
          </div>
          <div className="dashboard-performances" style={{ marginBottom: "1.5rem" }}>
            <div className="performances-header">
              <h4>Performances des matières premières</h4>
              <a href="#" className="see-all-link">
                Voir tout
              </a>
            </div>
            <table className="performances-table">
              <thead>
                <tr>
                  <th>Matière</th>
                  <th>Perf. 1j</th>
                  <th>Perf. 1s</th>
                  <th>Perf. 1m</th>
                  <th>Évolution</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Or</td>
                  <td className="up">+0.8%</td>
                  <td className="up">+2.2%</td>
                  <td className="up">+5.4%</td>
                  <td>
                    <svg width="60" height="24" viewBox="0 0 60 24">
                      <polyline
                        fill="none"
                        stroke="#4fd1c5"
                        strokeWidth="2"
                        points="0,20 10,15 20,10 30,8 40,12 50,6 60,10"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Argent</td>
                  <td className="down">-1.3%</td>
                  <td className="down">-0.8%</td>
                  <td className="up">+3.2%</td>
                  <td>
                    <svg width="60" height="24" viewBox="0 0 60 24">
                      <polyline
                        fill="none"
                        stroke="#e53e3e"
                        strokeWidth="2"
                        points="0,10 10,12 20,18 30,20 40,15 50,18 60,14"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Pétrole (Brent)</td>
                  <td className="up">+2.9%</td>
                  <td className="up">+5.1%</td>
                  <td className="up">+8.7%</td>
                  <td>
                    <svg width="60" height="24" viewBox="0 0 60 24">
                      <polyline
                        fill="none"
                        stroke="#4fd1c5"
                        strokeWidth="2"
                        points="0,18 10,16 20,14 30,12 40,10 50,8 60,6"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Blé</td>
                  <td className="up">+1.5%</td>
                  <td className="up">+3.3%</td>
                  <td className="up">+6.1%</td>
                  <td>
                    <svg width="60" height="24" viewBox="0 0 60 24">
                      <polyline
                        fill="none"
                        stroke="#4fd1c5"
                        strokeWidth="2"
                        points="0,20 10,18 20,16 30,14 40,12 50,10 60,8"
                      />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td>Cuivre</td>
                  <td className="up">+0.7%</td>
                  <td className="up">+2.1%</td>
                  <td className="up">+4.9%</td>
                  <td>
                    <svg width="60" height="24" viewBox="0 0 60 24">
                      <polyline
                        fill="none"
                        stroke="#4fd1c5"
                        strokeWidth="2"
                        points="0,22 10,20 20,18 30,16 40,14 50,12 60,10"
                      />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="dashboard-volatility" style={{ marginBottom: "1.5rem" }}>
            <h4>Top 10 des matières premières les plus volatiles</h4>
            <table className="volatility-table">
              <thead>
                <tr>
                  <th>Matière</th>
                  <th>Variation (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Or</td>
                  <td className="up">+2.2%</td>
                </tr>
                <tr>
                  <td>Argent</td>
                  <td className="down">-1.8%</td>
                </tr>
                <tr>
                  <td>Pétrole (Brent)</td>
                  <td className="up">+5.1%</td>
                </tr>
                <tr>
                  <td>Blé</td>
                  <td className="up">+3.3%</td>
                </tr>
                <tr>
                  <td>Cuivre</td>
                  <td className="down">-0.7%</td>
                </tr>
                <tr>
                  <td>Maïs</td>
                  <td className="up">+2.9%</td>
                </tr>
                <tr>
                  <td>Café</td>
                  <td className="down">-1.2%</td>
                </tr>
                <tr>
                  <td>Soja</td>
                  <td className="up">+1.8%</td>
                </tr>
                <tr>
                  <td>Platine</td>
                  <td className="down">-0.5%</td>
                </tr>
                <tr>
                  <td>Aluminium</td>
                  <td className="up">+1.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="dashboard-volatility-recap">
            <h4>Récap. matières volatiles</h4>
            <ul>
              <li>
                Or{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +2.2%
                </span>
              </li>
              <li>
                Argent{" "}
                <span className="down" style={{ color: "#e53e3e" }}>
                  -1.8%
                </span>
              </li>
              <li>
                Pétrole (Brent){" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +5.1%
                </span>
              </li>
              <li>
                Blé{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +3.3%
                </span>
              </li>
              <li>
                Cuivre{" "}
                <span className="down" style={{ color: "#e53e3e" }}>
                  -0.7%
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="dashboard-main-right">
          <div className="dashboard-account-summary" style={{ marginBottom: "1.5rem" }}>
            <h4>Résumé du compte</h4>
            <ul>
              <li>
                <strong>Solde total :</strong> 12 500 €
              </li>
              <li>
                <strong>Positions en profit :</strong> 5
              </li>
              <li>
                <strong>Positions en perte :</strong> 2
              </li>
            </ul>
          </div>
          <div className="dashboard-portfolio-cards" style={{ marginBottom: "1.5rem" }}>
            <div className="portfolio-card">
              <h4>Valeur du portefeuille</h4>
              <p className="portfolio-value">12 500 €</p>
            </div>
            <div className="portfolio-card">
              <h4>Actifs en hausse</h4>
              <p className="up">7</p>
            </div>
            <div className="portfolio-card">
              <h4>Actifs en baisse</h4>
              <p className="down">3</p>
            </div>
            <div className="portfolio-card">
              <h4>Total des suivis</h4>
              <p className="portfolio-total">15</p>
            </div>
          </div>
          <div className="dashboard-volatility" style={{ marginBottom: "1.5rem" }}>
            <h4>Top 10 des actifs les plus volatils</h4>
            <table className="volatility-table">
              <thead>
                <tr>
                  <th>Actif</th>
                  <th>Variation (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bitcoin</td>
                  <td className="up">+7.2%</td>
                </tr>
                <tr>
                  <td>Ethereum</td>
                  <td className="down">-6.8%</td>
                </tr>
                <tr>
                  <td>Tesla</td>
                  <td className="up">+5.9%</td>
                </tr>
                <tr>
                  <td>GameStop</td>
                  <td className="up">+5.2%</td>
                </tr>
                <tr>
                  <td>Dogecoin</td>
                  <td className="down">-4.7%</td>
                </tr>
                <tr>
                  <td>Solana</td>
                  <td className="up">+4.3%</td>
                </tr>
                <tr>
                  <td>AMC</td>
                  <td className="down">-4.1%</td>
                </tr>
                <tr>
                  <td>Coinbase</td>
                  <td className="up">+3.8%</td>
                </tr>
                <tr>
                  <td>Meta</td>
                  <td className="down">-3.5%</td>
                </tr>
                <tr>
                  <td>Netflix</td>
                  <td className="up">+3.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="dashboard-volatility-recap">
            <h4>Récap. actifs volatils</h4>
            <ul>
              <li>
                Bitcoin{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +7.2%
                </span>
              </li>
              <li>
                Ethereum{" "}
                <span className="down" style={{ color: "#e53e3e" }}>
                  -6.8%
                </span>
              </li>
              <li>
                Tesla{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +5.9%
                </span>
              </li>
              <li>
                GameStop{" "}
                <span className="up" style={{ color: "#38b2ac" }}>
                  +5.2%
                </span>
              </li>
              <li>
                Dogecoin{" "}
                <span className="down" style={{ color: "#e53e3e" }}>
                  -4.7%
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {alertes.length > 0 && (
        <div className="dashboard-alerts card" style={{background:'#2d3748',color:'#ffd700',margin:'1.5rem 0',padding:'1.2rem',borderRadius:'0.8rem',fontWeight:600}}>
          <span role="img" aria-label="alerte" style={{marginRight:'0.7rem'}}>⚠️</span>
          Risque : Les actifs suivants n'ont pas de couverture active : {alertes.join(', ')}
        </div>
      )}
      <div className="dashboard-exposition card" style={{background:'#23272f',color:'#b5e3e8',margin:'1.5rem 0',padding:'1.2rem',borderRadius:'0.8rem'}}>
        <h4 style={{color:'#4fd1c5',marginBottom:'0.7rem'}}>Exposition nette par actif</h4>
        <ul style={{display:'flex',flexWrap:'wrap',gap:'1.5rem',listStyle:'none',padding:0}}>
          {actifs.length === 0 ? <li>Aucune exposition détectée.</li> :
            actifs.map(a => (
              <li key={a} style={{minWidth:'120px'}}>
                <span style={{fontWeight:700,color:'#ffd700'}}>{a}</span> : {expositionNette[a]}
              </li>
            ))}
        </ul>
      </div>
      <div className="dashboard-besthedge card" style={{background:'#23272f',color:'#b5e3e8',margin:'1.5rem 0',padding:'1.2rem',borderRadius:'0.8rem'}}>
        <h4 style={{color:'#ffd700',marginBottom:'0.7rem'}}>Stratégie de couverture recommandée</h4>
        {meilleure ? (
          <div>
            <span style={{fontWeight:700}}>{meilleure.type === 'futures' ? 'Futures' : 'Swap'}</span> — Efficacité : {(meilleure.efficacite*100).toFixed(0)}%, Coût : {meilleure.cout}, Volatilité : {meilleure.volatilite}
          </div>
        ) : <span>Aucune stratégie optimale trouvée.</span>}
      </div>
      <div className="dashboard-transactions" style={{ marginTop: "2rem", background: "#23272f", borderRadius: "1rem", boxShadow: "0 2px 12px #0007", padding: "1.5rem 1.2rem", border: "1px solid #333" }}>
        <h4 style={{marginBottom:'1.2rem', color:'#4fd1c5', letterSpacing:'0.5px'}}>Dernières transactions</h4>
        {transactions && transactions.length > 0 ? (
          <table className="transactions-table dashboard-tx-table" style={{background:'#181b20', borderRadius:'0.7rem', overflow:'hidden', fontSize:'1.07rem', borderCollapse:'separate', borderSpacing:0, width:'100%'}}>
            <thead>
              <tr style={{background:'#23272f', color:'#b5e3e8'}}>
                <th style={{padding:'0.7rem 0.5rem'}}>Date</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Actif</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Compte</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Type</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Quantité</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(-5).reverse().map((t, i) => (
                <tr key={i} style={{borderBottom:'1px solid #333', background: i%2===0 ? '#23272f' : '#1a1d22'}}>
                  <td style={{padding:'0.6rem 0.5rem', color:'#b5e3e8'}}>{t.date}</td>
                  <td style={{padding:'0.6rem 0.5rem'}}><span className="asset-badge" style={{background:'#2d3748', color:'#ffd700', padding:'0.2rem 0.7rem', borderRadius:'0.7rem', fontWeight:600}}>{t.asset}</span></td>
                  <td style={{padding:'0.6rem 0.5rem', color:'#4fd1c5', fontWeight:500}}>{t.accountName}</td>
                  <td style={{padding:'0.6rem 0.5rem'}}><span className={`action-badge action-${t.action}`} style={{background:t.action==="buy"?"#38b2ac":"#e53e3e", color:'#fff', borderRadius:'0.7rem', padding:'0.2rem 0.7rem', fontWeight:600}}>{t.actionLabel}</span></td>
                  <td style={{padding:'0.6rem 0.5rem', color:'#fff'}}>{t.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-tx" style={{color:'#b5e3e8', fontStyle:'italic'}}>Aucune transaction récente.</p>
        )}
      </div>
      <div className="dashboard-hedging" style={{ marginTop: "2rem", background: "#23272f", borderRadius: "1rem", boxShadow: "0 2px 12px #0007", padding: "1.5rem 1.2rem", border: "1px solid #333" }}>
        <h4 style={{marginBottom:'1.2rem', color:'#ffd700', letterSpacing:'0.5px'}}>Synthèse couverture (hedging)</h4>
        {couvertures && couvertures.length > 0 ? (
          <table className="transactions-table dashboard-hedge-table" style={{background:'#181b20', borderRadius:'0.7rem', overflow:'hidden', fontSize:'1.07rem', borderCollapse:'separate', borderSpacing:0, width:'100%'}}>
            <thead>
              <tr style={{background:'#23272f', color:'#b5e3e8'}}>
                <th style={{padding:'0.7rem 0.5rem'}}>Actif</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Type</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Quantité</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Spot</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Prix couverture</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Maturité</th>
                <th style={{padding:'0.7rem 0.5rem'}}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {couvertures.slice(-3).reverse().map((c, i) => (
                <tr key={i} style={{borderBottom:'1px solid #333', background: i%2===0 ? '#23272f' : '#1a1d22'}}>
                  <td style={{padding:'0.6rem 0.5rem', color:'#ffd700', fontWeight:600}}>{c.actif}</td>
                  <td style={{padding:'0.6rem 0.5rem', color:'#4fd1c5'}}>{c.type === 'futures' ? 'Futures' : 'Swap'}</td>
                  <td style={{padding:'0.6rem 0.5rem', color:'#fff'}}>{c.quantite}</td>
                  <td style={{padding:'0.6rem 0.5rem', color:'#b5e3e8'}}>{c.spot}</td>
                  <td style={{padding:'0.6rem 0.5rem', color:'#b5e3e8'}}>{c.prixCouverture}</td>
                  <td style={{padding:'0.6rem 0.5rem', color:'#b5e3e8'}}>{c.maturite}</td>
                  <td style={{padding:'0.6rem 0.5rem'}}><span style={{color:c.statut==="actif"?"#38b2ac":"#e53e3e",fontWeight:600}}>{c.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-tx" style={{color:'#b5e3e8', fontStyle:'italic'}}>Aucune couverture enregistrée.</p>
        )}
      </div>
    </section>
  );
}

function Notifications() {
  const [notifications, setNotifications] = React.useState([
    { id: 1, text: "Alerte : Couverture sur Or expirée.", type: "alerte", date: "21/06/2025", enabled: true },
    { id: 2, text: "Nouvelle analyse disponible sur le Blé.", type: "info", date: "20/06/2025", enabled: true },
    { id: 3, text: "Mise à jour : Marché du pétrole très volatil.", type: "alerte", date: "19/06/2025", enabled: false },
    { id: 4, text: "Votre compte a été synchronisé.", type: "info", date: "18/06/2025", enabled: true }
  ]);

  const toggleNotification = id => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  return (
    <section className="page-section">
      <h2>Notifications</h2>
      <div className="notifications-list card" style={{marginTop:'2rem',padding:'1.5rem',maxWidth:600,marginLeft:'auto',marginRight:'auto'}}>
        {notifications.length === 0 ? (
          <p style={{color:'#b5e3e8',fontStyle:'italic'}}>Aucune notification pour le moment.</p>
        ) : (
          <ul style={{listStyle:'none',padding:0}}>
            {notifications.map(n => (
              <li key={n.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#23272f',borderRadius:'0.7rem',padding:'1rem',marginBottom:'1rem',boxShadow:'0 1px 6px #0003'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.8rem'}}>
                  <span style={{fontSize:'1.3rem'}}>{n.type === 'alerte' ? '⚠️' : 'ℹ️'}</span>
                  <div>
                    <div style={{color:n.type==='alerte'?'#ffd700':'#4fd1c5',fontWeight:600}}>{n.text}</div>
                    <div style={{fontSize:'0.97rem',color:'#b5e3e8',marginTop:'0.2rem'}}>{n.date}</div>
                  </div>
                </div>
                <label style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <input type="checkbox" checked={n.enabled} onChange={()=>toggleNotification(n.id)} />
                  <span style={{color:'#b5e3e8',fontSize:'0.98rem'}}>Activer</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [couvertures, setCouvertures] = useState([]); // état global pour les couvertures

  // Réf pour le dashboard
  const dashboardRef = React.useRef(null);

  // Handler pour ajouter une transaction depuis Transactions
  const handleAddTransaction = tx => {
    setTransactions(ts => [...ts, tx]);
  };

  // Handler pour supprimer une transaction (par index)
  const handleDeleteTransaction = idx => {
    setTransactions(ts => ts.filter((_, i) => i !== idx));
  };

  // Handler pour ajouter une couverture depuis la page Couverture
  const handleAddCouverture = c => {
    setCouvertures(cs => [...cs, { ...c, statut: new Date(c.maturite) > new Date() ? "actif" : "expiré" }]);
  };

  // Persistance des infos Mon Compte après inscription
  const handleAuth = (userData) => {
    setUser(userData);
    // Enregistre en localStorage pour Accounts
    if (userData && userData.firstName && userData.lastName) {
      localStorage.setItem('quotfi_user_account', JSON.stringify(userData));
    }
  };

  // Vérifie si une couverture existe pour un actif donné
  function hasActiveHedge(couvertures, actif) {
    return couvertures.some(c => c.actif === actif && c.statut === "actif");
  }

  // Calcule l'exposition nette après application des couvertures actives
  function calculerExpositionNette(transactions, couvertures) {
    // On suppose que chaque transaction est un achat/vente sur un actif
    // et que chaque couverture réduit l'exposition sur cet actif
    const exp = {};
    transactions.forEach(t => {
      exp[t.asset] = (exp[t.asset] || 0) + (t.action === "buy" ? t.quantity : -t.quantity);
    });
    couvertures.filter(c => c.statut === "actif").forEach(c => {
      exp[c.actif] = (exp[c.actif] || 0) - c.quantite;
    });
    return exp;
  }

  // Sélectionne la meilleure stratégie de couverture selon le risque
  function choisirMeilleureCouverture(options, niveauRisque) {
    // options: [{type, efficacite, cout, volatilite}]
    // niveauRisque: "faible", "modéré", "élevé"
    // On privilégie l'efficacité pour risque élevé, le coût pour risque faible
    if (niveauRisque === "élevé") {
      return options.reduce((best, o) => o.efficacite > (best?.efficacite||0) ? o : best, null);
    } else if (niveauRisque === "faible") {
      return options.reduce((best, o) => o.cout < (best?.cout||Infinity) ? o : best, null);
    } else {
      // compromis coût/efficacité/volatilité
      return options.reduce((best, o) => {
        const score = o.efficacite - o.cout*0.5 - o.volatilite*0.3;
        const bestScore = best ? best.efficacite - best.cout*0.5 - best.volatilite*0.3 : -Infinity;
        return score > bestScore ? o : best;
      }, null);
    }
  }

  if (!user) {
    return <AuthGate onAuth={handleAuth} />;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">QuotFi</div>
        <div className="user-info-left">
          {user && user.firstName && user.lastName && (
            <span className="user-name">{user.firstName} {user.lastName}</span>
          )}
        </div>
        <ul className="nav-links">
          <li><button className={page==="dashboard"?"active":undefined} onClick={()=>setPage("dashboard")}>Accueil</button></li>
          <li><button className={page==="markets"?"active":undefined} onClick={()=>setPage("markets")}>Marchés</button></li>
          <li><button className={page==="notifications"?"active":undefined} onClick={()=>setPage("notifications")}>Notifications</button></li>
          <li><button className={page==="transactions"?"active":undefined} onClick={()=>setPage("transactions")}>Transactions</button></li>
          <li><button className={page==="accounts"?"active":undefined} onClick={()=>setPage("accounts")}>Mon Compte</button></li>
          <li><button className={page==="couverture"?"active":undefined} onClick={()=>setPage("couverture")}>Couverture</button></li>
          <li><button className="logout-btn" onClick={()=>{setUser(null); localStorage.removeItem('quotfi_user_account');}}>Déconnexion</button></li>
        </ul>
      </nav>
      <main className="main-content">
        {page==="dashboard" && <>
          <h1>Bienvenue sur QuotFi</h1>
          <p>Votre plateforme d’informations et d’analyses financières.</p>
          <button className="cta-button" onClick={() => {
            if (dashboardRef.current) {
              dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}>Découvrir les marchés</button>
          <div ref={dashboardRef} />
          <Dashboard 
            transactions={transactions} 
            couvertures={couvertures} 
            calculerExpositionNette={calculerExpositionNette}
            hasActiveHedge={hasActiveHedge}
            choisirMeilleureCouverture={choisirMeilleureCouverture}
          />
        </>}
        {page==="markets" && <Markets />}
        {page==="transactions" && <Transactions transactions={transactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />}
        {page==="accounts" && <Accounts />}
        {page==="couverture" && <Couverture onAddCouverture={handleAddCouverture} couvertures={couvertures} />}
        {page==="notifications" && <Notifications />}
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} QuotFi. Tous droits réservés.
      </footer>
    </div>
  );
}

export default App;
