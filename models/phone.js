var mongoose = require('mongoose');

var PhoneSchema = new mongoose.Schema({
  publicKey: String,
  phone: String,
});

module.exports = mongoose.model('phone', PhoneSchema);
