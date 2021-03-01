const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type!');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");  // buradaki backend/images server.js file'a gore path ediliyor. callback'in ikinci parametresi destination

  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);     // callback'in ikinci parametresi filename
  }
});



router.post('', checkAuth, multer({ storage: storage }).single("image"), (req,res,next) => {
  let imagePath = null;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  User.find({ email: req.body.to })
  .then(result => {
    if (result.length === 0) {
      res.status(404).json({
        message: 'Destination email is not found! Please try with valid email.'
      });
    } else {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        from: req.body.from,
        to: req.body.to,
        time: req.body.time,
        sender_id: req.userData.userId
      });
      const post_2 = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        from: req.body.from,
        to: req.body.to,
        time: req.body.time,
        sender_id: null
      });
      post_2.save();
      post.save().then(createdPost => {
          res.status(201).json({
            message: "Message is sent succesfully",
            post: {
              id: createdPost._id,
              title: createdPost.title,
              content: createdPost.content,
              imagePath: createdPost.imagePath,
              from: createdPost.from,
              to: createdPost.to,
              time: createdPost.time
            }
          });
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Sending message is failed!'
    });
  });;

});



router.get('/outbox', checkAuth, (req,res,next) => {
  const pageSize = +req.query.pagesize;  // query'lerden default olarak string gelir
  const currentPage = +req.query.page;
  const postQuery = Post.find({ from: req.userData.email, sender_id: req.userData.userId });
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
    /* skip bastan kaç taneyi es geçecegini belirtir.
    limit kaç tane alınacagını soyler */
  }
  postQuery
  .then(documents => {
    fetchedPosts = documents;
    return Post.count({ from: req.userData.email, sender_id: req.userData.userId });
  })
  .then(count => {
    res.status(200).json({
      message:"Outbox is send succesfully!",
      posts: fetchedPosts,
      maxPosts: count // number
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Displaying outbox is failed!'
    });
  });;

});


router.get('/inbox', checkAuth, (req,res,next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find({ to: req.userData.email, sender_id: null });
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
  .then(documents => {
    fetchedPosts = documents;
    return Post.count({ to: req.userData.email, sender_id: null });
  })
  .then(count => {
    res.status(200).json({
      message:"Inbox is send successfully!",
      posts: fetchedPosts,
      maxPosts: count // number
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Displaying inbox is failed!'
    });
  });;

});


router.get('/:id', (req,res,next) => {
  Post.findById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Message is not found!"
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Fetching a message is failed!'
    });
  });;
});


router.delete('/outbox/:id', checkAuth, (req,res,next) => {
  Post.deleteOne({ _id: req.params.id, from: req.userData.email, sender_id: req.userData.userId })
  .then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Deletion is successful!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Deleting message is failed!'
    });
  });;
});


router.delete('/inbox/:id', checkAuth, (req,res,next) => {
  Post.deleteOne({ _id: req.params.id, to: req.userData.email, sender_id: null })
  .then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: "Deletion is successful!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Deleting message is failed!'
    });
  });;
});

module.exports = router;
