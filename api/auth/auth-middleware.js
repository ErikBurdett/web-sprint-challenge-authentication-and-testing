const db = require('../../data/dbConfig')

const validateBody = async(req, res, next) =>{
    let {username, password } = req.body

    if(!username || !password){
        res.status(400).json({
            message: "username and password required"
        })
        return;
    }
next();
}

const usernameTaken = async(req, res, next)=>{
    const user = await db('users')
    .where({ username: req.body.username})
    .first()

    if(user){
        res.status(400).json({ message: "username taken" })
        return;
      }
    
      next();
}

const userExists = async (req, res, next) => {
    const user = await db('users')
      .where({ username: req.body.username })
      .first()
  
    if (user) {
      req.user = user;
      next()
    } else {
        res.status(400).json({
            message: "invalid credentials"
          })
        }
      }

module.exports = {
    usernameTaken,
    validateBody,
    userExists
    }