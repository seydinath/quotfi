import { useState, useEffect, useRef } from "react";

// symbols: tableau de symboles Finnhub (ex: ["OANDA:XAUUSD", "AAPL"])
// fallbackData: tableau d'objets fallback (même ordre)
export default function useLiveFinnhubQuotes(symbols, fallbackData = []) {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef();

  const fetchQuotes = () => {
    symbols.forEach((symbol, i) => {
      setLoading(l => ({ ...l, [symbol]: true }));
      fetch(`/api/markets/quote/${encodeURIComponent(symbol)}`)
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .then(json => {
          setQuotes(q => ({ ...q, [symbol]: json }));
          setLoading(l => ({ ...l, [symbol]: false }));
          setLastUpdate(new Date());
        })
        .catch(() => {
          // fallback si erreur
          if (fallbackData[i]) {
            setQuotes(q => ({ ...q, [symbol]: fallbackData[i] }));
          }
          setLoading(l => ({ ...l, [symbol]: false }));
        });
    });
  };

  useEffect(() => {
    fetchQuotes();
    intervalRef.current = setInterval(fetchQuotes, 5000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [symbols.join(",")]);

  return { quotes, loading, lastUpdate };
}
