import React, { useState } from "react";
import LiveAssetChart from "./LiveAssetChart";

export default function AssetChartSelector({ dashboardAssets }) {
  const [selected, setSelected] = useState(dashboardAssets[0]?.symbol || "OANDA:XAUUSD");

  // Fallbacks historiques par actif (exemple sur 7 jours)
  const fallbackHistories = {
    "OANDA:XAUUSD": {
      labels: ["J-6","J-5","J-4","J-3","J-2","J-1","Aujourd'hui"],
      prices: [2320, 2335, 2340, 2330, 2345, 2342, 2340.5]
    },
    "OANDA:XAGUSD": {
      labels: ["J-6","J-5","J-4","J-3","J-2","J-1","Aujourd'hui"],
      prices: [28.7, 29.2, 29.5, 29.3, 29.7, 29.4, 29.1]
    },
    "OANDA:BCOUSD": {
      labels: ["J-6","J-5","J-4","J-3","J-2","J-1","Aujourd'hui"],
      prices: [80.1, 80.8, 81.5, 81.9, 82.5, 82.1, 82.3]
    },
    "EUREX:WHEAT": {
      labels: ["J-6","J-5","J-4","J-3","J-2","J-1","Aujourd'hui"],
      prices: [241, 242, 243, 244, 245, 245.2, 245.5]
    },
    "OANDA:XCUUSD": {
      labels: ["J-6","J-5","J-4","J-3","J-2","J-1","Aujourd'hui"],
      prices: [9700, 9720, 9750, 9780, 9800, 9805, 9800]
    },
    "^FCHI": {
      labels: ["J-6","J-5","J-4","J-3","J-2","J-1","Aujourd'hui"],
      prices: [7380, 7390, 7400, 7410, 7420, 7425, 7420.15]
    }
  };

  return (
    <div>
      <div style={{marginBottom:'0.7rem'}}>
        <label htmlFor="asset-select" style={{marginRight:'0.7em',color:'#b5e3e8'}}>Sélectionner un actif :</label>
        <select
          id="asset-select"
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={{padding:'0.3em 0.7em',borderRadius:'0.5em',background:'#23272f',color:'#ffd700',border:'1px solid #4fd1c5'}}
        >
          {dashboardAssets.map(a => (
            <option key={a.symbol} value={a.symbol}>{a.label}</option>
          ))}
        </select>
      </div>
      <LiveAssetChart symbol={selected} fallbackHistory={fallbackHistories[selected]} />
    </div>
  );
}
