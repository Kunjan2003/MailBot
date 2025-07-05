const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  to: String,
  subject: String,
  body: String,
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number
  }],
  sentAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

module.exports = mongoose.model('Mail', mailSchema);
