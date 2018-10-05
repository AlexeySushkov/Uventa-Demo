var mongoose = require('mongoose');

var UspSchema = new mongoose.Schema({
  secretKey: String,
  usp: String,
});

module.exports = mongoose.model('usp', UspSchema);
