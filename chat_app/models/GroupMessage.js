const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
  from_user: {
    type: String,
    required: [true, 'Sender username is required']
  },
  room: {
    type: String,
    required: [true, 'Room name is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  date_sent: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toLocaleString('en-US', {
        month: '2-digit', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    }
  }
});

module.exports = mongoose.model('GroupMessage', groupMessageSchema);
