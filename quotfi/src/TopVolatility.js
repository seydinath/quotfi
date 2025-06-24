import React, { useEffect, useState } from 'react';
import { API_URL } from "./api";

function TopVolatility() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/markets/top-volatility`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API');
        return res.json();
      })
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(e => {
        setError('Impossible de charger les actifs volatils');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement…</div>;
  if (error) return <div style={{color:'#e53e3e'}}>{error}</div>;

  return (
    <div className="dashboard-volatility card" style={{marginBottom:'1.5rem',background:'#23272f',padding:'1.5rem',borderRadius:'1rem'}}>
      <h4>Top actifs les plus volatils</h4>
      <table className="volatility-table" style={{width:'100%',color:'#b5e3e8',background:'#181b20',borderRadius:'0.7rem',overflow:'hidden',fontSize:'1.07rem'}}>
        <thead>
          <tr>
            <th>Actif</th>
            <th>Variation (%)</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(a => (
            <tr key={a.symbol}>
              <td>{a.name}</td>
              <td style={{ color: a.variation > 0 ? '#38b2ac' : '#e53e3e', fontWeight:600 }}>
                {a.variation > 0 ? '+' : ''}{a.variation.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopVolatility;
