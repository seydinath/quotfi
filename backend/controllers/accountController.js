const Account = require('../models/Account');

exports.create = async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'Champs requis manquants.' });
    const account = await Account.create({
      user: req.user.id,
      name,
      type,
      balance: 10000
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.list = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, balance } = req.body;
    const account = await Account.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { name, type, balance } },
      { new: true }
    );
    if (!account) return res.status(404).json({ message: 'Compte non trouvé.' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findOneAndDelete({ _id: id, user: req.user.id });
    if (!account) return res.status(404).json({ message: 'Compte non trouvé.' });
    res.json({ message: 'Compte supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
