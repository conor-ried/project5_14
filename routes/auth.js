/** Auth-related routes. */

const User = require('../models/user');
const express = require('express');
const router = express.Router();
const createTokenForUser = require('../helpers/createToken');


/** Register user; return token.
 *
 *  Accepts {username, first_name, last_name, email, phone, password}.
 *
 *  Returns {token: jwt-token-string}.
 *
 */

router.post('/register', async function(req, res, next) {
  try {
    console.log(req.body);
    const { username, password, first_name, last_name, email, phone } = req.body;
    let user = await User.register({username, password, first_name, last_name, email, phone});
    const token = createTokenForUser(username, user.admin);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
}); // end
// POST to http://localhost:3000/auth/register
// { "username" : "boewfr", "password" : "bofwe39", 
//  "first_name": "bobbyefwewf", "last_name": "seageefwr", 
//  "email": "bobbyseefwags@aol.com", "phone": "6562652656" }
//  {
// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvZXdmciIsImFkbWluIjpmYWxzZSwiaWF0IjoxNjgzOTk1OTg4fQ.wuCttJfGLQ48IaZNsC5yIbZkXV5yR-f80w8AKBJzxA0"
// }
/** Log in user; return token.
 *
 *  Accepts {username, password}.
 *
 *  Returns {token: jwt-token-string}.
 *
 *  If incorrect username/password given, should raise 401.
 *
 */

router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;
    //Added await to user.authenticate
    let user = await User.authenticate(username, password);
    const token = createTokenForUser(username, user.admin);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}); // end
// { "username" : "bobseager", "password" : "bobseager39", 
//  "first_name": "bobby", "last_name": "seager", 
//  "email": "bobbyseags@aol.com", "phone": "6562652656", "admin": false }
// {
// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvYnNlYWdlciIsImFkbWluIjpmYWxzZSwiaWF0IjoxNjgzODk3MDMxfQ.HvIZAgRuYSmoT20Vus2PeDv9Om_5TYk56opCz_l6gac"
// }
module.exports = router;
