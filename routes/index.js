const express = require('express');
const { getUserById } = require('../controllers/user-controller');
const { getUserTransactions, getAllTransactionsWithUserDetails } = require('../controllers/transcation-controller');

const router = express.Router();

router.get('/users/:id', getUserById);
router.get('/transactions/user/:userId', getUserTransactions);
router.get('/transactions', getAllTransactionsWithUserDetails);

module.exports = router;
