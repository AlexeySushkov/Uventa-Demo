var mongoose = require('mongoose');

var UspSchema = new mongoose.Schema({
  publicKey: String,
  usp: String,
});

module.exports = mongoose.model('usp', UspSchema);
