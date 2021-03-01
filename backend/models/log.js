const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const logSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  loginTime: { type: String },
  logoutTime: { type: String },
  browser: { type: String },
  ip: { type: String }
});


logSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Log',logSchema);
