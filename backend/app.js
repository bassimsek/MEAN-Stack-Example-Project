const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


const app = express();

mongoose.connect('mongodb+srv://orcun:lJ6BK5jtKFCQjKtk@cluster0-uainq.mongodb.net/node-angular')
.then(() => {
  console.log('Connected to database successfully!');
})
.catch(() => {
  console.log('Database connection failed.');
});


app.enable('trust proxy');


app.use(bodyParser.json());
// urlencoded data için bu line'i kullanabilirsin
// app.use(bodyParser.urlencoded({ extended: false}));
app.use('/images', express.static(path.join('backend/images')));


app.use(cors());
app.options('*', cors());

app.get('/favicon.ico', (req, res) => res.status(204));


app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);


module.exports = app;
