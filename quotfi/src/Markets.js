import React from "react";

function Markets() {
  const [selected, setSelected] = React.useState(null);
  const [period, setPeriod] = React.useState("1j");
  const data = [
    // MATIÈRES PREMIÈRES
    {
      name: "Or",
      last: "2,340.50",
      change: "+0.8%",
      up: true,
      volume: "210K",
      open: "2,335.00",
      high: "2,355.00",
      low: "2,330.00",
      chart: {
        "1j": [22, 21, 22, 23, 22, 23, 24, 23, 22, 23, 24],
        "1s": [21, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22],
        "1m": [20, 21, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23],
        "1a": [19, 20, 21, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22, 23, 24, 23, 22]
      },
      type: "Métal précieux",
      spread: "0.25 USD",
      leverage: "1:20",
      session: "24h (pause 23h-0h)"
    },
    {
      name: "Argent",
      last: "29.10",
      change: "-1.3%",
      up: false,
      volume: "180K",
      open: "29.50",
      high: "29.80",
      low: "28.90",
      chart: {
        "1j": [18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18],
        "1s": [19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18],
        "1m": [17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18],
        "1a": [16, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19, 18, 17, 18, 19]
      },
      type: "Métal précieux",
      spread: "0.05 USD",
      leverage: "1:20",
      session: "24h (pause 23h-0h)"
    },
    {
      name: "Pétrole (Brent)",
      last: "82.30",
      change: "+2.9%",
      up: true,
      volume: "1.1M",
      open: "80.00",
      high: "83.00",
      low: "79.80",
      chart: {
        "1j": [15, 16, 17, 18, 19, 20, 21, 22, 23, 22, 21],
        "1s": [16, 17, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 17],
        "1m": [17, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20],
        "1a": [18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19]
      },
      type: "Énergie",
      spread: "0.05 USD",
      leverage: "1:10",
      session: "ICE (1h-23h)"
    },
    {
      name: "Blé (Euronext)",
      last: "245.50",
      change: "+1.5%",
      up: true,
      volume: "320K",
      open: "242.00",
      high: "247.00",
      low: "241.00",
      chart: {
        "1j": [12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16],
        "1s": [13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12],
        "1m": [14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 13, 14, 15],
        "1a": [15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14]
      },
      type: "Agricole",
      spread: "0.5 EUR",
      leverage: "1:10",
      session: "Euronext (10h45-18h30)"
    },
    {
      name: "Cuivre",
      last: "9,800",
      change: "+0.7%",
      up: true,
      volume: "110K",
      open: "9,750",
      high: "9,900",
      low: "9,700",
      chart: {
        "1j": [10, 11, 12, 13, 14, 15, 16, 17, 16, 15, 14],
        "1s": [11, 12, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12, 11, 10],
        "1m": [12, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12, 11, 10, 11, 12, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12, 11, 10, 11, 12, 13],
        "1a": [13, 14, 15, 16, 17, 16, 15, 14, 13, 12, 11, 10, 11, 12, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12, 11, 10, 11, 12, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12, 11, 10, 11, 12, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12]
      },
      type: "Métal industriel",
      spread: "10 USD",
      leverage: "1:10",
      session: "LME (1h-19h)"
    },
    {
      name: "EUR/USD",
      last: "1.0850",
      change: "+0.12%",
      up: true,
      volume: "1.2M",
      open: "1.0835",
      high: "1.0870",
      low: "1.0810",
      chart: {
        "1j": [20, 18, 19, 21, 20, 22, 23, 21, 20, 19, 20],
        "1s": [18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 20, 18, 19, 20],
        "1m": [17, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20],
        "1a": [15, 16, 17, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20]
      },
      type: "Forex",
      spread: "0.8 pip",
      leverage: "1:30",
      session: "Londres/New York (8h-22h)"
    },
    {
      name: "BTC/USD",
      last: "67,200",
      change: "+1.85%",
      up: true,
      volume: "32K",
      open: "66,000",
      high: "68,000",
      low: "65,800",
      chart: {
        "1j": [10, 12, 15, 18, 20, 19, 21, 23, 22, 24, 23],
        "1s": [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 23],
        "1m": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10],
        "1a": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 23, 22, 21]
      },
      type: "Crypto",
      spread: "30 USD",
      leverage: "1:2",
      session: "24/7"
    },
    {
      name: "Apple",
      last: "195.30",
      change: "-0.45%",
      up: false,
      volume: "8.1M",
      open: "196.00",
      high: "197.20",
      low: "194.80",
      chart: {
        "1j": [15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13],
        "1s": [14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15],
        "1m": [13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14],
        "1a": [12, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 14, 15]
      },
      type: "Action",
      spread: "0.02 USD",
      leverage: "1:5",
      session: "Nasdaq (15h30-22h)"
    },
    {
      name: "CAC 40",
      last: "7,420.15",
      change: "+0.67%",
      up: true,
      volume: "1.5B",
      open: "7,390.00",
      high: "7,450.00",
      low: "7,380.00",
      chart: {
        "1j": [18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18],
        "1s": [19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22],
        "1m": [17, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20],
        "1a": [16, 17, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19]
      },
      type: "Indice",
      spread: "1.5 pt",
      leverage: "1:20",
      session: "Euronext (9h-17h30)"
    }
  ];

  // Fonction utilitaire pour calculer les stats de la courbe
  function getChartStats(chart) {
    if (!chart || chart.length === 0) return {};
    const min = Math.min(...chart);
    const max = Math.max(...chart);
    const avg = (chart.reduce((a, b) => a + b, 0) / chart.length).toFixed(2);
    const maxIndex = chart.indexOf(max);
    const minIndex = chart.indexOf(min);
    return {
      min,
      max,
      avg,
      maxIndex,
      minIndex
    };
  }

  return (
    <section className="page-section">
      <h2>Marchés</h2>
      <div className="markets-table-wrapper">
        <table className="markets-table">
          <thead>
            <tr>
              <th>Actif</th>
              <th>Dernier cours</th>
              <th>Variation</th>
              <th>Volume</th>
              <th>Ouverture</th>
              <th>Plus haut</th>
              <th>Plus bas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.name} className={selected===i?"selected":undefined} onClick={()=>setSelected(i)} style={{cursor:'pointer'}}>
                <td>{row.name}</td>
                <td>{row.last}</td>
                <td className={row.up?"up":"down"}>{row.change}</td>
                <td>{row.volume}</td>
                <td>{row.open}</td>
                <td>{row.high}</td>
                <td>{row.low}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected!==null && (() => {
        const chart = data[selected].chart[period];
        const stats = getChartStats(chart);
        return (
          <div className="markets-chart-modal">
            <div className="markets-chart-content">
              <h3>Évolution de {data[selected].name}</h3>
              <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'0.5rem'}}>
                <label htmlFor="period-select"><strong>Période :</strong></label>
                <select id="period-select" value={period} onChange={e=>setPeriod(e.target.value)}>
                  <option value="1j">1 jour</option>
                  <option value="1s">1 semaine</option>
                  <option value="1m">1 mois</option>
                  <option value="1a">1 an</option>
                </select>
              </div>
              <svg width="320" height="80" viewBox="0 0 320 80">
                <polyline
                  fill="none"
                  stroke="#4fd1c5"
                  strokeWidth="3"
                  points={chart.map((y,idx)=>`${idx*(320/(chart.length-1))},${80-y*3}`).join(' ')}
                />
              </svg>
              <div className="markets-asset-details">
                <ul>
                  <li><strong>Type :</strong> {data[selected].type}</li>
                  <li><strong>Spread moyen :</strong> {data[selected].spread}</li>
                  <li><strong>Levier max :</strong> {data[selected].leverage}</li>
                  <li><strong>Session principale :</strong> {data[selected].session}</li>
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
        );
      })()}
    </section>
  );
}

export default Markets;
