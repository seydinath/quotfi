const mongoose = require('mongoose');

const couvertureSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actif: { type: String, required: true },
  type: { type: String, required: true },
  quantite: { type: Number, required: true },
  spot: { type: Number, required: true },
  prixCouverture: { type: Number, required: true },
  maturite: { type: String, required: true },
  date: { type: String, required: true },
  statut: { type: String, required: true }
});

module.exports = mongoose.model('Couverture', couvertureSchema);
