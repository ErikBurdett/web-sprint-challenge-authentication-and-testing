const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../../data/dbConfig')
const {validateBody, usernameTaken, userExists} = require('./auth-middleware')

router.post('/register', validateBody, usernameTaken, async(req, res)=>{
  let user = req.body

  const hash = bcrypt.hashSync(user.password, 8)
  user.password = hash

  db('users').insert(user)
    .then(([id])=>{
      return db('users').where({id})
    })
    .then(([user]) => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json({ error: err, message: "Something went wrong with the server :(" })
    })
});

router.post('/login', validateBody, userExists, (req, res) => {

let { username, password } = req.body
let user = req.user 

if (bcrypt.compareSync(password, user.password)){
  const token = makeToken(user)

  res.status(200).json({
    message: `welcome, ${username}`,
    token
  }) 
} else {
  res.status(401).json({ message: "invalid credentials" })
}
});

function makeToken(user){
const payload = {
  subject: user.id,
  username: user.username,
  role: user.role
}
const options = {
  expiresIn: "500s"
}
return jwt.sign(payload, "keep it secret",options)
}


module.exports = router;
