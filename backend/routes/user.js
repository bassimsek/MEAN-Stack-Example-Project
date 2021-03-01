const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const Log = require('../models/log');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();



router.post('/signup', (req, res, next) => {
  let pure_password = req.body.password;
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      surname: req.body.surname,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      isAdmin: req.body.isAdmin
    });
    user.save()
    .then(result => {
      const token = jwt.sign(
        { email: result.email, password: pure_password, userId: result._id },
        "secret_herhangi_bir_string_olabilir",
        { expiresIn: "1h" }
      );
      const log = new Log({
        email: req.body.email,
        loginTime: req.body.loginTime,
        logoutTime: '',
        browser: req.body.browser,
        ip: req.body.ip
      });
      log.save()
      .then(() => {
        res.status(201).json({
          message: 'User is created successfully!',
          token: token,
          expiresIn: 3600,
          userMail: result.email,
          isAdmin: result.isAdmin
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "This mail address is taken before. Please choose another one!"
      });
    });
  });

});


router.get('/user_infos/:userMail', checkAuth, (req, res, next) => {
  User.findOne({ email: req.params.userMail })
  .then(result => {
    if (result) {
      const userData = new User({
        id: result._id,
        name: result.name,
        surname: result.surname,
        email: result.email,
        password: req.userData.password,
        birthdate: result.birthdate,
        gender: result.gender,
        isAdmin: result.isAdmin
      });
      res.status(200).json(userData);
    } else {
      res.status(404).json({
        message: "User is not found!"
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: "User is not found!"
    });
  });
});



router.put('/ch_password/:userMail', checkAuth, (req, res, next) => {
  let pure_password = req.body.newPassword;
  bcrypt.hash(req.body.newPassword, 10)
  .then(hash => {
    const hashed_password = hash;
    User.findOneAndUpdate(
      { email: req.params.userMail },
      { $set: { password: hashed_password } },
      { new: true })
      .then(result => {
        const token = jwt.sign(
          { email: result.email, password: pure_password, userId: result._id },
          "secret_herhangi_bir_string_olabilir",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          message: "Password is changed!",
          token: token,
          user: result
        });
     })
     .catch(err => {
      res.status(500).json({
        message: 'Change password is failed!'
      });
    });
 });

});


router.post('/login', (req, res, next) => {
  let fetchedUser;
  let pure_password = req.body.password;
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Your credentials are not correct!"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if (typeof(result) === 'boolean' && !result) {
      return res.status(401).json({
        message: "Your credentials are not correct!"
      });
    } else if(typeof(result) !== 'object') {
      const token = jwt.sign(
        { email: fetchedUser.email, password: pure_password, userId: fetchedUser._id },
        "secret_herhangi_bir_string_olabilir",
        { expiresIn: "1h" }
      );
      Log.findOneAndUpdate(
        { email: req.body.email },
        { $set: {
          loginTime: req.body.loginTime,
          browser: req.body.browser,
          ip: req.body.ip} },
        { new: true })
        .then(doc => {
          res.status(200).json({
            token: token,
            expiresIn: 3600,
            user: fetchedUser
          });
        });
    }
  })
  .catch(err => {
    return res.status(401).json({
      message: "Your credentials are not correct!"
    });
  });
});


router.get('/show_user_logs', checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const logQuery = Log.find();
  let fetchedUserLogs;
  if (pageSize && currentPage) {
    logQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  logQuery
  .then(documents => {
    fetchedUserLogs = documents;
    return Log.count();
  })
  .then(count => {
    res.status(200).json({
      message:"User Logs are sent succesfully!",
      userLogs: fetchedUserLogs,
      maxUserLogs: count
    });
  })
  .catch(err => {
    return res.status(500).json({
      message: "User logs can not be fetched!!!"
    });
  });
});


router.get('/show_users', checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find();
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  userQuery
  .then(documents => {
    fetchedUsers = documents;
    return User.count();
  })
  .then(count => {
    res.status(200).json({
      message:"Users are sent succesfully!",
      users: fetchedUsers,
      maxUsers: count
    });
  })
  .catch(err => {
    return res.status(500).json({
      message: "Users can not be fetched!!!"
    });
  });
});



router.post('/create_user', checkAuth, (req,res,next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      surname: req.body.surname,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      isAdmin: req.body.isAdmin
    });
    user.save()
    .then(result => {
      const log = new Log({
        email: req.body.email,
        loginTime: '',
        logoutTime: '',
        browser: '',
        ip: ''
      });
      log.save()
      .then(() => {
        res.status(201).json({
          message: 'User is created successfully!'
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'This email is already taken before. Please choose another one!'
      });
    });
  });
});



router.delete('/delete/:mail', checkAuth, (req,res,next) => {
  User.deleteOne({ email: req.params.mail })
  .then(result => {
    if (result.n > 0) {
      Log.deleteOne({ email: req.params.mail })
      .then(result => {
        res.status(200).json({
          message: "Deletion is successful!"
        });
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Deleting user is failed!'
    });
  });
});




router.put('/update_user/:userId', checkAuth, (req,res,next) => {
  if (req.body.password === '') {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: {
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        isAdmin: req.body.isAdmin} })
        .then(result => {
          Log.findOneAndUpdate(
            { email: req.body.oldMail },
            { $set: {email: req.body.email} }).then(() => {
              res.status(200).json({
                message: "Update is successful!"
              });
            })
        })
        .catch(err => {
          res.status(500).json({
            message: 'Updating user is failed!'
          });
        });
  } else {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const updated_user = new User({
        _id: req.params.userId,
        email: req.body.email,
        password: hash,
        name: req.body.name,
        surname: req.body.surname,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        isAdmin: req.body.isAdmin
      });
      User.updateOne({ _id: req.params.userId }, updated_user).then(result => {
        if (result.nModified > 0) {
          Log.findOneAndUpdate(
            { email: req.body.oldMail },
            { $set: {email: req.body.email} }).then(() => {
              res.status(200).json({
                message: "Update is successful!"
              });
            })
        } else {
          res.status(401).json({
            message: "Not authorized!"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: 'Updating user is failed!'
        });
      });
    });
  }
});


router.post('/logout', checkAuth, (req, res, next) => {
  Log.findOneAndUpdate(
    { email: req.body.email },
    { $set: {logoutTime: req.body.logoutTime} },
    { new: true })
    .then(doc => {
      res.status(200).json({
        message: "Logout successful!"
      });
    });
});


module.exports = router;
