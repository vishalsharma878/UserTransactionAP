const Transaction = require('../models/transcation-model');
const User = require('../models/user-model');

exports.getUserTransactions = async (req, res) => {
  try {

    const { userId } = req.params;
    const { status, type, from, to } = req.query;
    const filter = {userId};
    
    if (status) filter.status = status;
    if (type) filter.type = type;

    if (from || to) {
      filter.transactionDate = {};
      if (from) filter.transactionDate.$gte = new Date(from);
      if (to) filter.transactionDate.$lte = new Date(to);
    }

    const transactions = await Transaction.find(filter);
    console.log(transactions);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTransactionsWithUserDetails = async (req, res) => {
  try {
    const { status, type, from, to } = req.query;

    const match = {};
    if (status) match.status = status;
    if (type) match.type = type;
    if (from || to) {
      match.transactionDate = {};
      if (from) match.transactionDate.$gte = new Date(from);
      if (to) match.transactionDate.$lte = new Date(to);
    }

    const transactions = await Transaction.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
    ]);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
