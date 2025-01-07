const Transaction = require('../models/transcation-model');
const User = require('../models/user-model');

exports.getUserTransactions = async (req, res) => {
  try {

    const { userId } = req.params;
    const { status, type, from, to, page = 1, limit = 10 } = req.query;
    const filter = {userId};

    if (status) filter.status = status;
    if (type) filter.type = type;

    if (from || to) {
      filter.transactionDate = {};
      if (from) filter.transactionDate.$gte = new Date(from);
      if (to) filter.transactionDate.$lte = new Date(to);
    }

     // Calculate pagination values
     const skip = (page - 1) * limit;

     // Fetch transactions with pagination
     const transactions = await Transaction.find(filter)
       .skip(skip)
       .limit(parseInt(limit))
       .lean();
 
     const totalCount = await Transaction.countDocuments(filter);
 
     res.status(200).json({
       success: true,
       page: parseInt(page),
       limit: parseInt(limit),
       totalCount,
       totalPages: Math.ceil(totalCount / limit),
       data: transactions,
     });
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
