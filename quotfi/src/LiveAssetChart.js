import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const SYMBOL_LABELS = {
  "OANDA:XAUUSD": "Or (XAU/USD)",
  "OANDA:XAGUSD": "Argent (XAG/USD)",
  "OANDA:BCOUSD": "Pétrole (Brent)",
  "EUREX:WHEAT": "Blé (Euronext)",
  "OANDA:XCUUSD": "Cuivre (XCU/USD)",
  "^FCHI": "CAC 40"
};

export default function LiveAssetChart({ symbol, interval = 60, fallbackHistory }) {
  const [history, setHistory] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const fallbackDep = JSON.stringify(fallbackHistory);

  useEffect(() => {
    let timer;
    let isMounted = true;
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      setUsedFallback(false);
      try {
        // Appel à l'API backend pour l'historique (à adapter selon votre backend)
        const res = await fetch(`/api/markets/history/${encodeURIComponent(symbol)}?interval=${interval}`);
        if (!res.ok) throw new Error("Erreur API Finnhub");
        const data = await res.json();
        if (isMounted) {
          setHistory(data.prices || []);
          setLabels(data.labels || []);
        }
      } catch (e) {
        setError(e.message);
        // Fallback si fourni
        if (fallbackHistory && fallbackHistory.prices && fallbackHistory.labels) {
          setHistory(fallbackHistory.prices);
          setLabels(fallbackHistory.labels);
          setUsedFallback(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
    timer = setInterval(fetchHistory, 15000); // refresh toutes les 15s
    return () => { isMounted = false; clearInterval(timer); };
  }, [symbol, interval, fallbackDep, fallbackHistory]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: SYMBOL_LABELS[symbol] || symbol,
        data: history,
        fill: false,
        borderColor: "#4fd1c5",
        backgroundColor: "#38b2ac",
        tension: 0.2,
        pointRadius: 2
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: false } },
      y: { display: true, title: { display: false } }
    }
  };

  if (error && usedFallback && history && history.length > 0) {
    return <div style={{position:'relative'}}>
      <Line data={chartData} options={chartOptions} height={220} />
      <div style={{position:'absolute',top:10,right:10,background:'#e53e3e',color:'#fff',padding:'0.3em 0.7em',borderRadius:'0.7em',fontSize:'0.97em'}}>Données non à jour</div>
    </div>;
  }
  if (error && (!history || history.length === 0)) {
    return <div style={{color:'#e53e3e',textAlign:'center',margin:'1.5em 0'}}>
      <span style={{fontSize:'1.3em',marginRight:'0.5em'}}>⚠️</span>
      Données du graphique momentanément indisponibles.<br/>
      <span style={{color:'#b5e3e8',fontSize:'0.97em'}}>Le service sera rétabli automatiquement.</span>
    </div>;
  }
  if (!loading && !error && history && history.length === 0) {
    return <div style={{color:'#b5e3e8'}}>Aucune donnée à afficher pour cet actif.</div>;
  }

  return <Line data={chartData} options={chartOptions} height={220} />;
}
