import React from "react";
import useLiveFinnhubQuotes from "./useLiveFinnhubQuotes";

// Mapping des actifs fictifs vers leur symbol Finnhub
const assetSymbolMap = {
  "Or": "OANDA:XAUUSD",
  "Argent": "OANDA:XAGUSD",
  "Pétrole (Brent)": "OANDA:BCOUSD",
  "Blé (Euronext)": "EUREX:WHEAT",
  "Cuivre": "OANDA:XCUUSD",
  "EUR/USD": "OANDA:EURUSD",
  "BTC/USD": "BINANCE:BTCUSDT",
  "Apple": "AAPL",
  "CAC 40": "^FCHI"
};

const assetList = [
  "Or",
  "Argent",
  "Pétrole (Brent)",
  "Blé (Euronext)",
  "Cuivre",
  "EUR/USD",
  "BTC/USD",
  "Apple",
  "CAC 40"
];

function Markets() {
  const [selected, setSelected] = React.useState(null);
  const [period, setPeriod] = React.useState("1j");
  // Ajout pour rafraîchissement auto
  const [refreshKey, setRefreshKey] = React.useState(0);
  // Historique dynamique Yahoo
  const [chartData, setChartData] = React.useState({}); // { [asset]: { [period]: [points] } }
  const [chartLoading, setChartLoading] = React.useState(false);
  const [chartError, setChartError] = React.useState(null);

  // fallbackData pour chaque actif (ordre identique à assetList)
  const fallbackData = [
    { current: 2340.5, prevClose: 2335, open: 2335, high: 2355, low: 2330, volume: "210K" },
    { current: 29.1, prevClose: 29.5, open: 29.5, high: 29.8, low: 28.9, volume: "180K" },
    { current: 82.3, prevClose: 80, open: 80, high: 83, low: 79.8, volume: "1.1M" },
    { current: 245.5, prevClose: 242, open: 242, high: 247, low: 241, volume: "320K" },
    { current: 9800, prevClose: 9750, open: 9750, high: 9900, low: 9700, volume: "110K" },
    { current: 1.085, prevClose: 1.0835, open: 1.0835, high: 1.087, low: 1.081, volume: "1.2M" },
    { current: 67200, prevClose: 66000, open: 66000, high: 68000, low: 65800, volume: "32K" },
    { current: 195.3, prevClose: 196, open: 196, high: 197.2, low: 194.8, volume: "8.1M" },
    { current: 7420.15, prevClose: 7390, open: 7390, high: 7450, low: 7380, volume: "1.5B" }
  ];

  const symbols = assetList.map(name => assetSymbolMap[name]);
  // Passer refreshKey à useLiveFinnhubQuotes (ou équivalent) si besoin
  const { quotes: liveData, loading, lastUpdate } = useLiveFinnhubQuotes(symbols, fallbackData, refreshKey);

  // Métadonnées statiques pour chaque actif (type, spread, etc.)
  const meta = {
    "Or": { type: "Métal précieux", spread: "0.25 USD", leverage: "1:20", session: "24h (pause 23h-0h)" },
    "Argent": { type: "Métal précieux", spread: "0.05 USD", leverage: "1:20", session: "24h (pause 23h-0h)" },
    "Pétrole (Brent)": { type: "Énergie", spread: "0.05 USD", leverage: "1:10", session: "ICE (1h-23h)" },
    "Blé (Euronext)": { type: "Agricole", spread: "0.5 EUR", leverage: "1:10", session: "Euronext (10h45-18h30)" },
    "Cuivre": { type: "Métal industriel", spread: "10 USD", leverage: "1:10", session: "LME (1h-19h)" },
    "EUR/USD": { type: "Forex", spread: "0.8 pip", leverage: "1:30", session: "Londres/New York (8h-22h)" },
    "BTC/USD": { type: "Crypto", spread: "30 USD", leverage: "1:2", session: "24/7" },
    "Apple": { type: "Action", spread: "0.02 USD", leverage: "1:5", session: "Nasdaq (15h30-22h)" },
    "CAC 40": { type: "Indice", spread: "1.5 pt", leverage: "1:20", session: "Euronext (9h-17h30)" }
  };

  // Utilitaire pour stats courbe
  function getChartStats(chart) {
    if (!chart || chart.length === 0) return {};
    const min = Math.min(...chart);
    const max = Math.max(...chart);
    const avg = (chart.reduce((a, b) => a + b, 0) / chart.length).toFixed(2);
    const maxIndex = chart.indexOf(max);
    const minIndex = chart.indexOf(min);
    return { min, max, avg, maxIndex, minIndex };
  }

  // Rafraîchit toutes les 5 minutes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(k => k + 1);
    }, 300000); // 5 min
    return () => clearInterval(interval);
  }, []);

  // Effet pour charger l'historique Yahoo Finance à l'ouverture de la modale ou changement de période ou refresh
  React.useEffect(() => {
    if (selected === null) return;
    const name = assetList[selected];
    const symbol = assetSymbolMap[name];
    // Recharge à chaque refreshKey
    setChartLoading(true);
    setChartError(null);
    fetch(`/api/markets/history/${encodeURIComponent(symbol)}?period=${period}`)
      .then(r => {
        if (!r.ok) throw new Error("Erreur API historique");
        return r.json();
      })
      .then(data => {
        setChartData(prev => ({
          ...prev,
          [name]: {
            ...prev[name],
            [period]: data.history || []
          }
        }));
        setChartLoading(false);
      })
      .catch(e => {
        setChartError(e.message);
        setChartLoading(false);
      });
  }, [selected, period, refreshKey]);

  return (
    <section className="page-section">
      <h2>Marchés</h2>
      <div style={{fontSize:'0.95rem',color:'#4fd1c5',marginBottom:'0.7rem',textAlign:'right'}}>
        {lastUpdate && <>Données live : {lastUpdate.toLocaleDateString()} {lastUpdate.toLocaleTimeString()}</>}
      </div>
      <div className="markets-table-wrapper" style={{background:'#181b20',borderRadius:'1rem',boxShadow:'0 2px 12px #0007',padding:'2rem 1.5rem',border:'1px solid #333',marginBottom:'2rem'}}>
        <table className="markets-table" style={{width:'100%',borderCollapse:'separate',borderSpacing:'0 0.7rem',fontSize:'1.09rem',color:'#b5e3e8'}}>
          <thead>
            <tr style={{background:'#23272f',color:'#ffd700',height:'3.2rem'}}>
              <th style={{padding:'0.9rem 0.7rem',borderRadius:'0.7rem 0 0 0.7rem',textAlign:'left'}}>Actif</th>
              <th style={{padding:'0.9rem 0.7rem',textAlign:'left'}}>Dernier cours</th>
              <th style={{padding:'0.9rem 0.7rem',textAlign:'left'}}>Variation</th>
              <th style={{padding:'0.9rem 0.7rem',textAlign:'left'}}>Volume</th>
              <th style={{padding:'0.9rem 0.7rem',textAlign:'left'}}>Ouverture</th>
              <th style={{padding:'0.9rem 0.7rem',textAlign:'left'}}>Plus haut</th>
              <th style={{padding:'0.9rem 0.7rem',borderRadius:'0 0.7rem 0.7rem 0',textAlign:'left'}}>Plus bas</th>
            </tr>
          </thead>
          <tbody>
            {assetList.map((name, i) => {
              const symbol = assetSymbolMap[name];
              const live = liveData[symbol];
              const isLoading = loading[symbol];
              let last = live?.current ?? '--';
              let prevClose = live?.prevClose ?? null;
              let pct = (last && prevClose) ? ((last - prevClose) / prevClose) * 100 : null;
              let change = pct !== null ? (pct > 0 ? `+${pct.toFixed(2)}%` : `${pct.toFixed(2)}%`) : '--';
              let up = pct !== null ? pct > 0 : null;
              let volume = live?.volume ?? fallbackData[i]?.volume ?? '--';
              let open = live?.open ?? '--';
              let high = live?.high ?? '--';
              let low = live?.low ?? '--';
              return (
                <tr key={name} className={selected===i?"selected":undefined} onClick={()=>setSelected(i)} style={{cursor:'pointer',background:selected===i?'#23272f':'#20232a',boxShadow:'0 1px 6px #0003',borderRadius:'0.7rem',marginBottom:'0.7rem',transition:'background 0.2s'}}>
                  <td style={{padding:'1.1rem 0.7rem',fontWeight:600,color:'#ffd700',borderRadius:'0.7rem 0 0 0.7rem'}}>{name}</td>
                  <td style={{padding:'1.1rem 0.7rem'}}>{isLoading ? '⏳' : last}</td>
                  <td style={{padding:'1.1rem 0.7rem',color:up===null?'#b5e3e8':up?'#38b2ac':'#e53e3e',fontWeight:600}}>{isLoading ? '⏳' : change}</td>
                  <td style={{padding:'1.1rem 0.7rem'}}>{isLoading ? '⏳' : volume}</td>
                  <td style={{padding:'1.1rem 0.7rem'}}>{isLoading ? '⏳' : open}</td>
                  <td style={{padding:'1.1rem 0.7rem'}}>{isLoading ? '⏳' : high}</td>
                  <td style={{padding:'1.1rem 0.7rem',borderRadius:'0 0.7rem 0.7rem 0'}}>{isLoading ? '⏳' : low}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {Object.values(loading).some(Boolean) && (
          <div style={{color:'#ffd700',marginTop:'0.7rem'}}>⏳ Chargement des données live…</div>
        )}
        {Object.values(liveData).every(q=>!q) && (
          <div style={{color:'#e53e3e',marginTop:'0.7rem'}}>⚠️ Fallback sur données fictives ou API indisponible</div>
        )}
      </div>
      {selected!==null && (() => {
        const name = assetList[selected];
        // Utilise l'historique dynamique si dispo, sinon fallback sur courbe fictive
        const chart = (chartData[name] && chartData[name][period]) || chartData[name]?.[period] || [];
        const fallbackChart = fallbackChartData[name]?.[period] || [];
        const stats = getChartStats(chart.length ? chart : fallbackChart);
        return (
          <div className="markets-chart-modal-overlay" onClick={()=>setSelected(null)}>
            <div className="markets-chart-modal" onClick={e=>e.stopPropagation()}>
              <div className="markets-chart-content">
                <h3>Évolution de {name}</h3>
                <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'0.5rem'}}>
                  <label htmlFor="period-select"><strong>Période :</strong></label>
                  <select id="period-select" value={period} onChange={e=>setPeriod(e.target.value)}>
                    <option value="1j">1 jour</option>
                    {/* Ajoute d'autres périodes si backend les gère */}
                  </select>
                </div>
                {chartLoading ? (
                  <div style={{color:'#ffd700'}}>⏳ Chargement du graphique…</div>
                ) : chartError ? (
                  <div style={{color:'#e53e3e'}}>⚠️ Erreur API historique : {chartError}<br/>Fallback sur courbe fictive.</div>
                ) : chart.length === 0 ? (
                  <div style={{color:'#e53e3e'}}>⚠️ Pas de données pour cette période.<br/>Fallback sur courbe fictive.</div>
                ) : null}
                <svg width="320" height="80" viewBox="0 0 320 80">
                  <polyline
                    fill="none"
                    stroke="#4fd1c5"
                    strokeWidth="3"
                    points={(chart.length ? chart : fallbackChart).map((y,idx)=>`${idx*(320/((chart.length?chart:fallbackChart).length-1))},${80-y*3}`).join(' ')}
                  />
                </svg>
                <div className="markets-asset-details">
                  <ul>
                    <li><strong>Type :</strong> {meta[name].type}</li>
                    <li><strong>Spread moyen :</strong> {meta[name].spread}</li>
                    <li><strong>Levier max :</strong> {meta[name].leverage}</li>
                    <li><strong>Session principale :</strong> {meta[name].session}</li>
                  </ul>
                  <div className="markets-chart-stats">
                    <h4>Statistiques de la courbe</h4>
                    <ul>
                      <li><strong>Valeur min :</strong> {stats.min}</li>
                      <li><strong>Valeur max :</strong> {stats.max}</li>
                      <li><strong>Moyenne :</strong> {stats.avg}</li>
                      <li><strong>Point le plus haut (#{stats.maxIndex+1}) :</strong> {stats.max}</li>
                      <li><strong>Point le plus bas (#{stats.minIndex+1}) :</strong> {stats.min}</li>
                    </ul>
                  </div>
                </div>
                <button className="close-modal" onClick={()=>setSelected(null)}>Fermer</button>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}

// Fallback courbes fictives (ancienne chartData)
const fallbackChartData = {
  "Or": { "1j": [22, 21, 22, 23, 22, 23, 24, 23, 22, 23, 24] },
  "Argent": { "1j": [18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18] },
  "Pétrole (Brent)": { "1j": [15, 16, 17, 18, 19, 20, 21, 22, 23, 22, 21] },
  "Blé (Euronext)": { "1j": [12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16] },
  "Cuivre": { "1j": [10, 11, 12, 13, 14, 15, 16, 17, 16, 15, 14] },
  "EUR/USD": { "1j": [20, 18, 19, 21, 20, 22, 23, 21, 20, 19, 20] },
  "BTC/USD": { "1j": [10, 12, 15, 18, 20, 19, 21, 23, 22, 24, 23] },
  "Apple": { "1j": [15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13] },
  "CAC 40": { "1j": [18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18] }
};

export default Markets;
