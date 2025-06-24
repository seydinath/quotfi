const yahooFinance = require('yahoo-finance2').default;

// Liste d'actifs à surveiller (Yahoo Finance symbols)
const assets = [
  { name: 'Or', symbol: 'GC=F' }, // Gold Futures
  { name: 'Argent', symbol: 'SI=F' }, // Silver Futures
  { name: 'Pétrole (Brent)', symbol: 'BZ=F' }, // Brent Crude Oil Futures
  { name: 'Blé', symbol: 'ZW=F' }, // Wheat Futures
  { name: 'Cuivre', symbol: 'HG=F' }, // Copper Futures
  { name: 'Bitcoin', symbol: 'BTC-USD' },
  { name: 'Ethereum', symbol: 'ETH-USD' },
  { name: 'Tesla', symbol: 'TSLA' },
  { name: 'GameStop', symbol: 'GME' },
  { name: 'Dogecoin', symbol: 'DOGE-USD' }
];

// GET /api/markets/top-volatility
module.exports = async function topVolatilityHandler(req, res) {
  try {
    const results = await Promise.all(
      assets.map(async a => {
        try {
          const quote = await yahooFinance.quote(a.symbol);
          if (!quote || !quote.regularMarketPrice || !quote.regularMarketPreviousClose) {
            return { ...a, variation: 0 };
          }
          const variation = ((quote.regularMarketPrice - quote.regularMarketPreviousClose) / quote.regularMarketPreviousClose) * 100;
          return { ...a, variation };
        } catch (e) {
          return { ...a, variation: 0 };
        }
      })
    );
    // Trie par variation absolue décroissante et prend les 10 premiers
    const sorted = results.sort((a, b) => Math.abs(b.variation) - Math.abs(a.variation)).slice(0, 10);
    res.json(sorted);
  } catch (e) {
    res.status(500).json({ error: 'Erreur calcul volatilité', details: e.message });
  }
};
