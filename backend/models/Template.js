
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  subject: String,
  body: String,
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);

