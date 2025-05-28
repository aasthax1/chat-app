const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const message = new Message({
            sender: req.user.id,
            content,
            chatId
        });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).populate('sender', 'username');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
