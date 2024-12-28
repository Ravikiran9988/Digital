const User = require('../models/User');

exports.makeTransaction = async (req, res) => {
  try {
    const { sender_upi_id, receiver_upi_id, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const sender = await User.findOne({ upi_id: sender_upi_id });
    const receiver = await User.findOne({ upi_id: receiver_upi_id });

    if (!sender || sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    if (!receiver) {
      return res.status(400).json({ message: 'Receiver not found' });
    }

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Transaction successful' });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
