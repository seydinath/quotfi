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

app.use('/api/users', userRoutes);
app.use('/api/couvertures', couvertureRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('API QuotFi backend OK');
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quotfi';

mongoose.connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Serveur backend démarré sur le port ${PORT}`));
  })
  .catch(err => console.error('Erreur MongoDB:', err));
