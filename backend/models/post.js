const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true},
  imagePath: { type: String },
  from: { type: String, required: true},
  to: { type: String, required: true},
  time: { type: String, required: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  /*from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  to: { type: mongoose.Schema.Types.String, ref: "User", required: true},
  time: { type: Date, required: true } */
  // ref:User objectid'nin user modeline ait bir id oldugunu belirtiyor
});


module.exports = mongoose.model('Post',postSchema);
