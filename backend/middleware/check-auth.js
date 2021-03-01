const jwt = require('jsonwebtoken');


// burda kendimiz bir middleware tanımladık jwt verification icin

module.exports = (req, res, next) => {
  /* frontend'den gelen token "Bearer fgbdsfgdsfhjkdsfd" şeklinde geliyor.
  yani boslukla split edip 1. indexi alırsak token'i almıs oluruz. */
  try {
    const token = req.headers.authorization.split(" ")[1]; // error fırlatır boyle bi header yoksa o yuzden try'in icinde
    const decodedToken = jwt.verify(token, "secret_herhangi_bir_string_olabilir"); // bu da error fırlatır
    req.userData = {
      email: decodedToken.email,
      password: decodedToken.password,
      userId: decodedToken.userId
      /* requeste userData diye yeni bir kısım ekledik
      frontend'den gelen decodedToken'in bilgileriyle */
    };
    next(); // hersey yolunda giderse request bu middlawere'den baskasına devam eder
  } catch(error) {
    res.status(401).json({
      message: "Auth is failed"
    });
  }


};
