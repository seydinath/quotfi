const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asset: { type: String, required: true },
  accountName: { type: String, required: true },
  action: { type: String, required: true },
  actionLabel: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: String, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
