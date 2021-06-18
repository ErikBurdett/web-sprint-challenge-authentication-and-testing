const jwt = require('jsonwebtoken')



module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if(token){
    jwt.verify(token, "keep it secret", (err, decoded)=>{
      if (!err){
        req.decodedToken = decoded;
        next();
        return;
      }
      res.status(401).json({
        message: "token invalid"
      })
      return;
    })
    return;
}

res.status(401).json({message: "token required"})
};
