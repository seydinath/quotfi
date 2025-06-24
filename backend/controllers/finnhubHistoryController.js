// Contrôleur historique pour un actif (à placer dans backend/controllers/finnhubController.js)
const yahooFinance = require('yahoo-finance2').default;

// Mapping des symboles Finnhub vers Yahoo Finance
const symbolMap = {
  'OANDA:XAUUSD': 'GC=F', // Or
  'OANDA:XAGUSD': 'SI=F', // Argent
  'OANDA:BCOUSD': 'BZ=F', // Pétrole (Brent)
  'EUREX:WHEAT': 'ZW=F', // Blé
  'OANDA:XCUUSD': 'HG=F', // Cuivre
  'OANDA:EURUSD': 'EURUSD=X', // EUR/USD
  'BINANCE:BTCUSDT': 'BTC-USD', // BTC/USD
  'AAPL': 'AAPL', // Apple
  '^FCHI': '^FCHI' // CAC 40
};

// GET /api/markets/history/:symbol?interval=60
exports.getHistory = async (req, res) => {
  const finnhubSymbol = req.params.symbol;
  const yahooSymbol = symbolMap[finnhubSymbol] || finnhubSymbol;
  const interval = req.query.interval || '60'; // en minutes (1, 5, 15, 30, 60, 90, 1d)
  // Fenêtre de 12h glissantes pour les intervalles courts, 30j pour 1d
  let period1, period2;
  const now = new Date();
  if (interval === '1d') {
    period1 = new Date(now.getTime() - 30 * 24 * 3600 * 1000); // 30 jours
  } else {
    period1 = new Date(now.getTime() - 12 * 3600 * 1000); // 12h
  }
  period2 = now;
  try {
    const result = await yahooFinance._chart(yahooSymbol, {
      period1,
      period2,
      interval: interval === '1' ? '1m' : interval === '5' ? '5m' : interval === '15' ? '15m' : interval === '30' ? '30m' : interval === '60' ? '60m' : '1d',
      includePrePost: false
    });
    if (!result || !result.indicators || !result.indicators.quote || !result.indicators.quote[0]) {
      return res.status(404).json({ error: 'Aucune donnée historique trouvée.' });
    }
    const prices = result.indicators.quote[0].close;
    const labels = result.timestamp.map(ts => {
      const d = new Date(ts * 1000);
      return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
    });
    res.json({ prices, labels });
  } catch (e) {
    res.status(500).json({ error: 'Erreur Yahoo Finance (historique)', details: e.message });
  }
};
