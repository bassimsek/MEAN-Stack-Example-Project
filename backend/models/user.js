const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  birthdate: { type: Date, required: true },
  gender: { type: String, required: true },
  isAdmin: { type: String, required: true }
});

/* required:true sağlanmazsa error fırlatır güvenilir
ama unique: true error fırlatmıyor. o yüzden npm install --save mongoose-unique-validator
paketini kurup alttaki satırla unique'i de guvenilir(error fırlatan) bir validator yapıyoruz */

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User',userSchema);
