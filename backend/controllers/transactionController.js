const Transaction = require('../models/Transaction');

exports.create = async (req, res) => {
  try {
    const tx = await Transaction.create({ ...req.body, user: req.user.id });
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.list = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
