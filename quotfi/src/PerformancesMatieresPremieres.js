import React from "react";

function PerformancesMatieresPremieres() {
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

  const filteredAssets = volatilityAssets.filter(a => [
    'Or','Argent','Pétrole (Brent)','Blé','Cuivre'
  ].includes(a.name));

  return (
    <div className="dashboard-performances-cards" style={{ marginBottom: "1.5rem" }}>
      <div className="performances-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
        <h4 style={{margin:0}}>Performances des matières premières</h4>
        <button className="see-all-link" style={{background:'none',border:'none',color:'#4fd1c5',fontWeight:600,cursor:'pointer',fontSize:'1rem',padding:0}}>Voir tout</button>
      </div>
      {loadingVolatility ? (
        <div className="dashboard-card" style={{textAlign:'center',color:'#ffd700',padding:'1.2rem'}}>Chargement…</div>
      ) : errorVolatility ? (
        <div className="dashboard-card" style={{textAlign:'center',color:'#e53e3e',padding:'1.2rem'}}>{errorVolatility}</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(210px,1fr))',gap:'1.2rem'}}>
          {filteredAssets.map(a => {
            const color = a.variation > 0 ? '#38b2ac' : a.variation < 0 ? '#e53e3e' : '#ffd700';
            const icon = a.variation > 0 ? '▲' : a.variation < 0 ? '▼' : '●';
            return (
              <div className="dashboard-card" key={a.symbol} style={{borderLeft:`4px solid ${color}`,display:'flex',flexDirection:'column',gap:'0.5rem',alignItems:'flex-start',background:'#181b20'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
                  <span style={{fontSize:'1.5rem',color:color}}>{icon}</span>
                  <span style={{fontWeight:700,fontSize:'1.08rem',color:color}}>{a.name}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
                  <span style={{fontWeight:600,fontSize:'1.15rem',color:color}}>{a.variation>0?'+':''}{a.variation.toFixed(2)}%</span>
                  <span style={{color:'#b5e3e8',fontSize:'0.97em'}}>1j</span>
                </div>
                <div style={{width:'100%',marginTop:'0.2rem'}}>
                  <svg width="100%" height="24" viewBox="0 0 60 24">
                    <polyline
                      fill="none"
                      stroke={a.variation>0?'#4fd1c5':'#e53e3e'}
                      strokeWidth="2"
                      points={a.variation>0?"0,20 10,15 20,10 30,8 40,12 50,6 60,10":"0,10 10,12 20,18 30,20 40,15 50,18 60,14"}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PerformancesMatieresPremieres;
