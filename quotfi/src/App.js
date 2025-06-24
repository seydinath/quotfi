import React, { useState } from "react";
import Markets from "./Markets";
import Transactions from "./Transactions";
import Accounts from "./Accounts";
import { Login, Register } from "./Login";
import AuthGate from "./AuthGate";
import "./App.css";
import Couverture from "./Couverture";
import useLiveFinnhubQuotes from "./useLiveFinnhubQuotes";
import AssetChartSelector from "./AssetChartSelector";
import TopVolatility from "./TopVolatility";
import PerformancesMatieresPremieres from "./PerformancesMatieresPremieres";

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

  // Liste des principaux actifs à afficher en live
  const dashboardAssets = [
    { label: "Or", symbol: "OANDA:XAUUSD" },
    { label: "Argent", symbol: "OANDA:XAGUSD" },
    { label: "Pétrole (Brent)", symbol: "OANDA:BCOUSD" },
    { label: "Blé (Euronext)", symbol: "EUREX:WHEAT" },
    { label: "Cuivre", symbol: "OANDA:XCUUSD" },
    { label: "CAC 40", symbol: "^FCHI" }
  ];
  // fallbackData: valeurs fictives pour chaque actif (dans l'ordre)
  const fallbackData = [
    { current: 2340.5, prevClose: 2335, open: 2335, high: 2355, low: 2330, change: 0.8 },
    { current: 29.1, prevClose: 29.5, open: 29.5, high: 29.8, low: 28.9, change: -1.3 },
    { current: 82.3, prevClose: 80, open: 80, high: 83, low: 79.8, change: 2.9 },
    { current: 245.5, prevClose: 242, open: 242, high: 247, low: 241, change: 1.5 },
    { current: 9800, prevClose: 9750, open: 9750, high: 9900, low: 9700, change: 0.7 },
    { current: 7420.15, prevClose: 7390, open: 7390, high: 7450, low: 7380, change: 0.67 }
  ];
  const { quotes: liveQuotes, loading: loadingQuotes, lastUpdate: lastUpdateQuotes } = useLiveFinnhubQuotes(
    dashboardAssets.map(a => a.symbol),
    fallbackData
  );

  // Résumé du marché mis à jour toutes les 10 minutes, seulement si quotes live chargées
  const [marketSummary, setMarketSummary] = React.useState({ html: null, last: 0 });
  React.useEffect(() => {
    const hasLive = Object.values(liveQuotes).some(q => q && q.current && q.prevClose);
    if (!hasLive) return; // n'affiche pas de résumé tant que pas de données live
    const now = Date.now();
    if (!marketSummary.last || now - marketSummary.last > 10 * 60 * 1000) {
      setMarketSummary({ html: getDashboardMarketSummary(), last: now });
    }
    const timer = setInterval(() => {
      setMarketSummary({ html: getDashboardMarketSummary(), last: Date.now() });
    }, 10 * 60 * 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [JSON.stringify(liveQuotes), JSON.stringify(loadingQuotes)]);

  // Génère un résumé dynamique du marché pour le dashboard (amélioré)
  function getDashboardMarketSummary() {
    const variations = dashboardAssets.map((a) => {
      const live = liveQuotes[a.symbol];
      if (live && live.current && live.prevClose) {
        const pct = ((live.current - live.prevClose) / live.prevClose) * 100;
        return { name: a.label, pct, current: live.current, prevClose: live.prevClose };
      }
      return { name: a.label, pct: null, current: null, prevClose: null };
    });
    const valid = variations.filter(v => v.pct !== null);
    if (valid.length === 0) return (
      <span style={{color:'#e53e3e',fontWeight:600}}>Résumé indisponible (données live non chargées)</span>
    );
    const up = valid.filter(v => v.pct > 0);
    const down = valid.filter(v => v.pct < 0);
    const flat = valid.filter(v => v.pct === 0);
    // Top 3 hausses/baisses
    const topUp = [...valid].sort((a,b)=>b.pct-a.pct).slice(0,3);
    const topDown = [...valid].sort((a,b)=>a.pct-b.pct).slice(0,3);
    // Tendance globale
    let tendance, tendanceColor, tendanceIcon;
    if (up.length > down.length) {
      tendance = `Marché en hausse (${up.length} en hausse, ${down.length} en baisse)`;
      tendanceColor = '#38b2ac';
      tendanceIcon = '▲';
    } else if (down.length > up.length) {
      tendance = `Marché en baisse (${down.length} en baisse, ${up.length} en hausse)`;
      tendanceColor = '#e53e3e';
      tendanceIcon = '▼';
    } else {
      tendance = `Marché stable (${flat.length} stables, ${up.length} en hausse, ${down.length} en baisse)`;
      tendanceColor = '#ffd700';
      tendanceIcon = '●';
    }
    return (
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(210px,1fr))',gap:'1.2rem'}}>
        <div className="dashboard-card" style={{borderLeft:`4px solid ${tendanceColor}`,display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'1.7rem',color:tendanceColor}}>{tendanceIcon}</span>
          <div>
            <h4 style={{margin:0, color:tendanceColor, fontSize:'1.08rem'}}>Tendance globale</h4>
            <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:tendanceColor}}>{tendance}</p>
          </div>
        </div>
        <div className="dashboard-card" style={{borderLeft:'4px solid #38b2ac',display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'1.7rem',color:'#38b2ac'}}>📈</span>
          <div>
            <h4 style={{margin:0, color:'#38b2ac', fontSize:'1.08rem'}}>Top hausses</h4>
            <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:'#38b2ac'}}>
              {topUp.map(v=>(<span key={v.name} style={{marginRight:'0.7em'}}>{v.name} <span className="up">{v.pct>0?`+${v.pct.toFixed(2)}%`:v.pct?.toFixed(2)+"%"}</span></span>))}
            </p>
          </div>
        </div>
        <div className="dashboard-card" style={{borderLeft:'4px solid #e53e3e',display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'1.7rem',color:'#e53e3e'}}>📉</span>
          <div>
            <h4 style={{margin:0, color:'#e53e3e', fontSize:'1.08rem'}}>Top baisses</h4>
            <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:'#e53e3e'}}>
              {topDown.map(v=>(<span key={v.name} style={{marginRight:'0.7em'}}>{v.name} <span className="down">{v.pct<0?v.pct.toFixed(2)+"%":"+0.00%"}</span></span>))}
            </p>
          </div>
        </div>
        <div className="dashboard-card" style={{borderLeft:'4px solid #ffd700',display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'1.7rem',color:'#ffd700'}}>📊</span>
          <div>
            <h4 style={{margin:0, color:'#ffd700', fontSize:'1.08rem'}}>Stats marché</h4>
            <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:'#ffd700'}}>
              {up.length} en hausse, {down.length} en baisse, {flat.length} stables
            </p>
          </div>
        </div>
        {Object.values(loadingQuotes).some(Boolean) && (
          <div className="dashboard-card" style={{borderLeft:'4px solid #ffd700',display:'flex',alignItems:'center',gap:'1rem'}}>
            <span style={{fontSize:'1.7rem',color:'#ffd700'}}>⏳</span>
            <div>
              <h4 style={{margin:0, color:'#ffd700', fontSize:'1.08rem'}}>Chargement</h4>
              <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:'#ffd700'}}>Données en cours de chargement…</p>
            </div>
          </div>
        )}
        {Object.values(liveQuotes).every(q=>!q) && (
          <div className="dashboard-card" style={{borderLeft:'4px solid #e53e3e',display:'flex',alignItems:'center',gap:'1rem'}}>
            <span style={{fontSize:'1.7rem',color:'#e53e3e'}}>⚠️</span>
            <div>
              <h4 style={{margin:0, color:'#e53e3e', fontSize:'1.08rem'}}>API indisponible</h4>
              <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:'#e53e3e'}}>Fallback sur données fictives ou API indisponible</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Ajout pour performances dynamiques matières premières ---
  const [volatilityAssets, setVolatilityAssets] = React.useState([]);
  const [loadingVolatility, setLoadingVolatility] = React.useState(true);
  const [errorVolatility, setErrorVolatility] = React.useState(null);
  React.useEffect(() => {
    setLoadingVolatility(true);
    fetch('/api/markets/top-volatility')
      .then(res => {
        if (!res.ok) throw new Error('Erreur API');
        return res.json();
      })
      .then(data => {
        setVolatilityAssets(data);
        setLoadingVolatility(false);
      })
      .catch(e => {
        setErrorVolatility('Impossible de charger les performances');
        setLoadingVolatility(false);
      });
  }, []);

  return (
    <section className="dashboard">
      <h2>Tableau de bord</h2>
      {lastUpdateQuotes && (
        <div style={{fontSize:'0.95rem',color:'#4fd1c5',marginBottom:'0.7rem',textAlign:'right'}}>
          Données live : {lastUpdateQuotes.toLocaleDateString()} {lastUpdateQuotes.toLocaleTimeString()}
        </div>
      )}
      <div className="dashboard-grid">
        <div className="dashboard-main-left">
          <div className="dashboard-cards" style={{ marginBottom: "1.5rem" }}>
            {/* Cartes dynamiques pour chaque actif du dashboard */}
            {dashboardAssets.map((a) => {
              const live = liveQuotes[a.symbol];
              const loading = loadingQuotes[a.symbol];
              let pct = null, current = null, prevClose = null;
              if (live && live.current && live.prevClose) {
                pct = ((live.current - live.prevClose) / live.prevClose) * 100;
                current = live.current;
                prevClose = live.prevClose;
              }
              let color = pct === null ? '#b5e3e8' : pct > 0 ? '#38b2ac' : pct < 0 ? '#e53e3e' : '#ffd700';
              let icon = pct === null ? '●' : pct > 0 ? '▲' : pct < 0 ? '▼' : '●';
              return (
                <div className="dashboard-card" key={a.symbol} style={{borderLeft:`4px solid ${color}`}}>
                  <h3>{a.label}</h3>
                  <p style={{fontWeight:600,fontSize:'1.08em',color}}>
                    {loading ? '⏳' : icon} {pct !== null ? `${pct>0?'+':''}${pct?.toFixed(2)}%` : '--'}
                  </p>
                  <p style={{color:'#b5e3e8',fontSize:'0.97em'}}>
                    {current !== null ? `Cours : ${current}` : ''}
                    {prevClose !== null ? ` (Clôture : ${prevClose})` : ''}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="dashboard-summary" style={{ marginBottom: "1.5rem" }}>
            <h4>Résumé du marché</h4>
            {/* Résumé du marché sous forme d'une seule carte */}
            <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', borderLeft: `4px solid ${marketSummary.html?.props?.children[0]?.props?.style?.color || '#ffd700'}` }}>
              {/* Tendance globale */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <span style={{ fontSize: '1.7rem', color: marketSummary.html?.props?.children[0]?.props?.style?.color || '#ffd700' }}>
                  {marketSummary.html?.props?.children[0]?.props?.children[0]?.props?.children || '●'}
                </span>
                <span style={{ fontWeight: 700, color: marketSummary.html?.props?.children[0]?.props?.style?.color || '#ffd700', fontSize: '1.08rem' }}>
                  {marketSummary.html?.props?.children[0]?.props?.children?.slice(1) || 'Indisponible'}
                </span>
              </div>
              {/* Top hausses et baisses */}
              <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem', color: '#38b2ac' }}>⬆️</span>
                  <span style={{ color: '#38b2ac', fontWeight: 600 }}>Top hausses :</span>
                  <span style={{ color: '#38b2ac' }}>
                    {marketSummary.html?.props?.children[1]?.props?.children[1]?.props?.children?.length > 0
                      ? marketSummary.html.props.children[1].props.children[1].props.children.map((el, i) => <span key={i}>{el}</span>)
                      : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem', color: '#e53e3e' }}>⬇️</span>
                  <span style={{ color: '#e53e3e', fontWeight: 600 }}>Top baisses :</span>
                  <span style={{ color: '#e53e3e' }}>
                    {marketSummary.html?.props?.children[1]?.props?.children[3]?.props?.children?.length > 0
                      ? marketSummary.html.props.children[1].props.children[3].props.children.map((el, i) => <span key={i}>{el}</span>)
                      : '—'}
                  </span>
                </div>
              </div>
              {/* Stats marché */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <span style={{ fontSize: '1.2rem', color: '#ffd700' }}>📊</span>
                <span style={{ color: '#ffd700', fontWeight: 600 }}>Stats :</span>
                <span style={{ color: '#ffd700' }}>
                  {(() => {
                    const variations = dashboardAssets.map((a) => {
                      const live = liveQuotes[a.symbol];
                      if (live && live.current && live.prevClose) {
                        const pct = ((live.current - live.prevClose) / live.prevClose) * 100;
                        return { name: a.label, pct };
                      }
                      return { name: a.label, pct: null };
                    });
                    const valid = variations.filter(v => v.pct !== null);
                    const up = valid.filter(v => v.pct > 0);
                    const down = valid.filter(v => v.pct < 0);
                    const flat = valid.filter(v => v.pct === 0);
                    return `${up.length} en hausse, ${down.length} en baisse, ${flat.length} stables`;
                  })()}
                </span>
              </div>
              {/* État données */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <span style={{ fontSize: '1.2rem', color: Object.values(loadingQuotes).some(Boolean) ? '#ffd700' : Object.values(liveQuotes).every(q=>!q) ? '#e53e3e' : '#38b2ac' }}>
                  {Object.values(loadingQuotes).some(Boolean) ? '⏳' : Object.values(liveQuotes).every(q=>!q) ? '⚠️' : '✅'}
                </span>
                <span style={{ color: Object.values(loadingQuotes).some(Boolean) ? '#ffd700' : Object.values(liveQuotes).every(q=>!q) ? '#e53e3e' : '#38b2ac', fontWeight: 600 }}>
                  {Object.values(loadingQuotes).some(Boolean)
                    ? 'Chargement en cours…'
                    : Object.values(liveQuotes).every(q=>!q)
                      ? 'Fallback ou API indisponible'
                      : 'Données à jour'}
                </span>
              </div>
            </div>
          </div>
          {/* Suppression du graphique CAC 40 statique, ajout d'un placeholder pour graphique Forex dynamique */}
          <div className="dashboard-card" style={{
            borderLeft: '4px solid #38b2ac',
            background: '#181b20',
            borderRadius: '0.8rem',
            padding: '1.2rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{display:'flex',alignItems:'center',gap:'0.7rem',marginBottom:'0.7rem'}}>
              <span style={{fontSize:'1.5rem',color:'#38b2ac'}}>💹</span>
              <h4 style={{margin:0, color:'#38b2ac', fontSize:'1.08rem'}}>Graphique Forex dynamique</h4>
            </div>
            <AssetChartSelector dashboardAssets={dashboardAssets} />
          </div>
          <div className="dashboard-performances" style={{ marginBottom: "1.5rem" }}>
            
            <PerformancesMatieresPremieres />
          </div>
          {/* Suppression du Top 10 des matières premières les plus volatiles */}
          
        </div>
        <div className="dashboard-main-right">
          <div className="dashboard-account-summary-cards" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <div className="dashboard-card" style={{ borderLeft: '4px solid #ffd700', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{fontSize:'1.7rem',color:'#ffd700'}}>💰</span>
              <div>
                <h4 style={{margin:0, color:'#ffd700', fontSize:'1.08rem'}}>Solde total</h4>
                <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:'#ffd700'}}>12 500 €</p>
              </div>
            </div>
            <div className="dashboard-card" style={{ borderLeft: '4px solid #38b2ac', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{fontSize:'1.7rem',color:'#38b2ac'}}>📈</span>
              <div>
                <h4 style={{margin:0, color:'#38b2ac', fontSize:'1.08rem'}}>Positions en profit</h4>
                <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:'#38b2ac'}}>5</p>
              </div>
            </div>
            <div className="dashboard-card" style={{ borderLeft: '4px solid #e53e3e', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{fontSize:'1.7rem',color:'#e53e3e'}}>📉</span>
              <div>
                <h4 style={{margin:0, color:'#e53e3e', fontSize:'1.08rem'}}>Positions en perte</h4>
                <p style={{margin:0, fontWeight:700, fontSize:'1.15rem', color:'#e53e3e'}}>2</p>
              </div>
            </div>
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
          <TopVolatility />
          

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
      <div className="dashboard-transactions" style={{ marginTop: "2rem", background: "#23272f", borderRadius: "1rem", boxShadow: "0 2px 12px #0007", padding: "2.2rem 1.7rem", border: "1px solid #333" }}>
        <h4 style={{marginBottom:'1.5rem', color:'#4fd1c5', letterSpacing:'0.5px', fontSize:'1.18rem'}}>Dernières transactions</h4>
        {transactions && transactions.length > 0 ? (
          <table className="transactions-table dashboard-tx-table" style={{background:'#181b20', borderRadius:'0.9rem', overflow:'hidden', fontSize:'1.13rem', borderCollapse:'separate', borderSpacing:'0 1.1rem', width:'100%'}}>
            <thead>
              <tr style={{background:'#23272f', color:'#b5e3e8', height:'3.2rem'}}>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left',borderRadius:'0.7rem 0 0 0.7rem'}}>Date</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left'}}>Actif</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left'}}>Compte</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left'}}>Type</th>
                <th style={{padding:'1.1rem 0.7rem',textAlign:'left',borderRadius:'0 0.7rem 0.7rem 0'}}>Quantité</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(-5).reverse().map((t, i) => (
                <tr key={i} style={{background: i%2===0 ? '#23272f' : '#1a1d22', boxShadow:'0 1px 6px #0003', borderRadius:'0.7rem', marginBottom:'1.1rem', transition:'background 0.2s'}}>
                  <td style={{padding:'1.1rem 0.7rem', color:'#b5e3e8', fontWeight:600, borderRadius:'0.7rem 0 0 0.7rem'}}>{t.date}</td>
                  <td style={{padding:'1.1rem 0.7rem'}}><span className="asset-badge" style={{background:'#2d3748', color:'#ffd700', padding:'0.3rem 0.9rem', borderRadius:'0.7rem', fontWeight:700, fontSize:'1.05em'}}>{t.asset}</span></td>
                  <td style={{padding:'1.1rem 0.7rem', color:'#4fd1c5', fontWeight:600}}>{t.accountName}</td>
                  <td style={{padding:'1.1rem 0.7rem'}}><span className={`action-badge action-${t.action}`} style={{background:t.action==="buy"?"#38b2ac":"#e53e3e", color:'#fff', borderRadius:'0.7rem', padding:'0.3rem 0.9rem', fontWeight:700, fontSize:'1.05em'}}>{t.actionLabel}</span></td>
                  <td style={{padding:'1.1rem 0.7rem', color:'#fff', borderRadius:'0 0.7rem 0.7rem 0'}}>{t.quantity}</td>
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
    <div className="app-container dashboard-layout">
      <aside className="sidebar">
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
      </aside>
      <main className="main-content dashboard-main">
        {page==="dashboard" && (
          <>
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
          </>
        )}
        {page==="markets" && <Markets />}
        {page==="transactions" && <Transactions transactions={transactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />}
        {page==="accounts" && <Accounts />}
        {page==="couverture" && <Couverture onAddCouverture={handleAddCouverture} couvertures={couvertures} />}
        {page==="notifications" && <Notifications />}
      </main>
      
    </div>
  );
}

export default App;
