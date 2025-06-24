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

// GET /api/markets/quote/:symbol
exports.getQuote = async (req, res) => {
  const finnhubSymbol = req.params.symbol;
  const yahooSymbol = symbolMap[finnhubSymbol] || finnhubSymbol;
  try {
    const quote = await yahooFinance.quote(yahooSymbol);
    if (!quote || !quote.regularMarketPrice || !quote.regularMarketPreviousClose) {
      return res.status(404).json({ error: 'Aucune donnée trouvée pour ce symbole.' });
    }
    res.json({
      current: quote.regularMarketPrice,
      prevClose: quote.regularMarketPreviousClose,
      open: quote.regularMarketOpen,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume
    });
  } catch (e) {
    res.status(500).json({ error: 'Erreur Yahoo Finance', details: e.message });
  }
};
