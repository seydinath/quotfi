require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- Import routes ---
const userRoutes = require('./routes/user');
const couvertureRoutes = require('./routes/couverture');
const transactionRoutes = require('./routes/transaction');
const marketsRoutes = require('./routes/markets');
const marketsHistoryRouter = require('./routes/marketsHistory');
const topVolatilityRouter = require('./routes/topVolatility');
const accountRoutes = require('./routes/account');

app.use('/api/users', userRoutes);
app.use('/api/couvertures', couvertureRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/markets', marketsRoutes);
app.use('/api/markets', marketsHistoryRouter);
app.use('/api/markets/top-volatility', topVolatilityRouter);
app.use('/api/accounts', accountRoutes);

app.get('/', (req, res) => {
  res.send('API QuotFi backend OK');
});

// Correction : Render impose d'utiliser process.env.PORT
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quotfi';

// Correction : options obsolètes supprimées
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Serveur backend démarré sur le port ${PORT}`));
  })
  .catch(err => console.error('Erreur MongoDB:', err));
