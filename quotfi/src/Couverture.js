import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Fonction de calcul gain/perte d'une couverture par contrat à terme
function calculerPnLCouverture({ spotInitial, spotFinal, prixFutures, quantite, type }) {
  // type: "futures" ou "swap"
  // Pour un hedge classique (futures):
  // Gain/perte position nue: (spotFinal - spotInitial) * quantite
  // Gain/perte couverture: (prixFutures - spotFinal) * quantite (short hedge)
  // Gain total couvert: (spotFinal - spotInitial) * quantite + (prixFutures - spotFinal) * quantite
  const pnlNue = (spotFinal - spotInitial) * quantite;
  let pnlCouverture = 0;
  if (type === "futures") {
    pnlCouverture = (prixFutures - spotFinal) * quantite;
  } else if (type === "swap") {
    // Pour un swap, on suppose un taux fixe vs variable (simplifié)
    pnlCouverture = (prixFutures - spotFinal) * quantite * 0.95; // swap moins efficace
  }
  return {
    pnlNue,
    pnlCouverture,
    pnlTotal: pnlNue + pnlCouverture
  };
}

// Génère des données de simulation sur 30 jours
function genererSimulation({ spotInitial, prixFutures, quantite, type }) {
  const jours = 30;
  const data = [];
  for (let i = 0; i < jours; i++) {
    // Simule un marché haussier: spot monte chaque jour
    const spot = spotInitial * (1 + 0.01 * i); // +1%/jour
    const { pnlNue, pnlCouverture, pnlTotal } = calculerPnLCouverture({
      spotInitial,
      spotFinal: spot,
      prixFutures,
      quantite,
      type
    });
    data.push({
      jour: i + 1,
      pnlNue,
      pnlTotal
    });
  }
  return data;
}

const typesCouverture = [
  { value: "futures", label: "Contrat à terme (Futures)" },
  { value: "swap", label: "Swap" }
];

const actifs = ["Or", "Pétrole (Brent)", "Blé", "Cuivre", "Argent"];

function FormCouverture({ onAdd }) {
  const [form, setForm] = useState({
    actif: actifs[0],
    type: typesCouverture[0].value,
    quantite: 1,
    spot: "",
    prixCouverture: "",
    maturite: ""
  });
  const [error, setError] = useState("");
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.spot || !form.prixCouverture || !form.maturite || isNaN(form.spot) || isNaN(form.prixCouverture) || isNaN(form.quantite)) {
      setError("Tous les champs doivent être valides.");
      return;
    }
    setError("");
    onAdd({
      ...form,
      quantite: Number(form.quantite),
      spot: Number(form.spot),
      prixCouverture: Number(form.prixCouverture),
      date: new Date().toLocaleDateString(),
      statut: "actif"
    });
    setForm({ actif: actifs[0], type: typesCouverture[0].value, quantite: 1, spot: "", prixCouverture: "", maturite: "" });
  };
  return (
    <form className="card couverture-form" style={{marginBottom:'2rem',padding:'2rem',background:'#23272f',maxWidth:480,marginLeft:'auto',marginRight:'auto',borderRadius:'1rem',boxShadow:'0 2px 12px #0007'}} onSubmit={handleSubmit}>
      <h3 style={{marginBottom:'1.5rem',color:'#ffd700',textAlign:'center',fontWeight:700}}>Nouvelle couverture</h3>
      <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
        <label style={{color:'#b5e3e8',fontWeight:500}}>Actif sous-jacent
          <select name="actif" value={form.actif} onChange={handleChange} required style={{width:'100%',marginTop:6,padding:'0.7rem',borderRadius:'0.5rem',background:'#181b20',color:'#fff',border:'1px solid #333',fontSize:'1.07rem'}}>{actifs.map(a=><option key={a}>{a}</option>)}</select>
        </label>
        <label style={{color:'#b5e3e8',fontWeight:500}}>Type de couverture
          <select name="type" value={form.type} onChange={handleChange} required style={{width:'100%',marginTop:6,padding:'0.7rem',borderRadius:'0.5rem',background:'#181b20',color:'#fff',border:'1px solid #333',fontSize:'1.07rem'}}>{typesCouverture.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select>
        </label>
        <label style={{color:'#b5e3e8',fontWeight:500}}>Quantité
          <input type="number" name="quantite" min={1} value={form.quantite} onChange={handleChange} required style={{width:'100%',marginTop:6,padding:'0.7rem',borderRadius:'0.5rem',background:'#181b20',color:'#fff',border:'1px solid #333',fontSize:'1.07rem'}} />
        </label>
        <label style={{color:'#b5e3e8',fontWeight:500}}>Prix spot (€)
          <input type="number" name="spot" value={form.spot} onChange={handleChange} required style={{width:'100%',marginTop:6,padding:'0.7rem',borderRadius:'0.5rem',background:'#181b20',color:'#fff',border:'1px solid #333',fontSize:'1.07rem'}} />
        </label>
        <label style={{color:'#b5e3e8',fontWeight:500}}>Prix de couverture (€)
          <input type="number" name="prixCouverture" value={form.prixCouverture} onChange={handleChange} required style={{width:'100%',marginTop:6,padding:'0.7rem',borderRadius:'0.5rem',background:'#181b20',color:'#fff',border:'1px solid #333',fontSize:'1.07rem'}} />
        </label>
        <label style={{color:'#b5e3e8',fontWeight:500}}>Date de maturité
          <input type="date" name="maturite" value={form.maturite} onChange={handleChange} required style={{width:'100%',marginTop:6,padding:'0.7rem',borderRadius:'0.5rem',background:'#181b20',color:'#fff',border:'1px solid #333',fontSize:'1.07rem'}} />
        </label>
      </div>
      {error && <div style={{color:'#e53e3e',margin:'1.2rem 0',textAlign:'center',fontWeight:600,background:'#1a1d22',borderRadius:'0.5rem',padding:'0.7rem'}}>{error}</div>}
      <button className="cta-button" type="submit" style={{width:'100%',marginTop:'1.5rem',padding:'0.9rem',fontSize:'1.13rem',fontWeight:700,background:'#ffd700',color:'#23272f',borderRadius:'0.7rem',border:'none',boxShadow:'0 1px 6px #0005',letterSpacing:'0.5px'}}>Enregistrer la couverture</button>
    </form>
  );
}

function TableCouvertures({ couvertures }) {
  return (
    <div className="card" style={{marginBottom:'2rem',padding:'1.5rem',background:'#23272f'}}>
      <h3>Transactions de couverture</h3>
      <table className="transactions-table" style={{width:'100%',background:'#181b20',borderRadius:'0.7rem',overflow:'hidden',fontSize:'1.07rem',borderCollapse:'separate',borderSpacing:0}}>
        <thead>
          <tr style={{background:'#23272f',color:'#b5e3e8'}}>
            <th>Actif</th>
            <th>Type</th>
            <th>Quantité</th>
            <th>Prix spot</th>
            <th>Prix couverture</th>
            <th>Date</th>
            <th>Maturité</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {couvertures.length === 0 ? <tr><td colSpan={8} style={{textAlign:'center',color:'#b5e3e8'}}>Aucune couverture enregistrée.</td></tr> :
            couvertures.map((c,i)=>(
              <tr key={i} style={{background:i%2===0?'#23272f':'#1a1d22'}}>
                <td>{c.actif}</td>
                <td>{typesCouverture.find(t=>t.value===c.type)?.label}</td>
                <td>{c.quantite}</td>
                <td>{c.spot}</td>
                <td>{c.prixCouverture}</td>
                <td>{c.date}</td>
                <td>{c.maturite}</td>
                <td><span style={{color:c.statut==="actif"?"#38b2ac":"#e53e3e",fontWeight:600}}>{c.statut}</span></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function GraphiqueCouverture({ simulation }) {
  const data = {
    labels: simulation.map(d=>`J${d.jour}`),
    datasets: [
      {
        label: "Position nue",
        data: simulation.map(d=>d.pnlNue),
        borderColor: "#e53e3e",
        backgroundColor: "rgba(229,62,62,0.1)",
        fill: false,
        tension: 0.2
      },
      {
        label: "Position couverte",
        data: simulation.map(d=>d.pnlTotal),
        borderColor: "#38b2ac",
        backgroundColor: "rgba(56,178,172,0.1)",
        fill: false,
        tension: 0.2
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff', font: { size: 14 } } },
      title: { display: true, text: "Évolution des pertes/gains avec et sans couverture (30 jours)", color:'#fff', font:{size:16} }
    },
    scales: {
      x: { ticks: { color: '#b5e3e8' } },
      y: { ticks: { color: '#b5e3e8' } }
    }
  };
  return (
    <div className="card" style={{padding:'1.5rem',background:'#23272f',marginBottom:'2rem'}}>
      <Line data={data} options={options} />
    </div>
  );
}

export default function Couverture({ onAddCouverture, couvertures }) {
  // Valeurs de démo pour la simulation
  const demo = couvertures && couvertures.length > 0 ? couvertures[couvertures.length-1] : {
    spot: 100,
    prixCouverture: 105,
    quantite: 10,
    type: "futures"
  };
  const simulation = genererSimulation({
    spotInitial: Number(demo.spot),
    prixFutures: Number(demo.prixCouverture),
    quantite: Number(demo.quantite),
    type: demo.type
  });
  return (
    <section className="page-section">
      <h2>Gestion des couvertures (hedging)</h2>
      <FormCouverture onAdd={onAddCouverture} />
      <TableCouvertures couvertures={couvertures || []} />
      <GraphiqueCouverture simulation={simulation} />
    </section>
  );
}
