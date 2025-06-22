const Couverture = require('../models/Couverture');

exports.create = async (req, res) => {
  try {
    const couverture = await Couverture.create({ ...req.body, user: req.user.id });
    res.status(201).json(couverture);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.list = async (req, res) => {
  try {
    const couvertures = await Couverture.find({ user: req.user.id });
    res.json(couvertures);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
