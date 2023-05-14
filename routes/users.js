/** User related routes. */

const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const {ExpressError, NotValidSchemaError} = require('../helpers/expressError');
const { authUser, requireLogin, requireAdmin } = require('../middleware/auth');
const jsonschema = require("jsonschema");
const userPatchSchema = require("../schema/userPatch.json");

/** GET /
 *
 * Get list of users. Only logged-in users should be able to use this.
 *
 * It should return only *basic* info:
 *    {users: [{username, first_name, last_name}, ...]}
 *
 */

router.get('/', authUser, requireLogin, async function(req, res, next) {
  try {
    let users = await User.getAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
}); // end

/** GET /[username]
 *
 * Get details on a user. Only logged-in users should be able to use this.
 *
 * It should return:
 *     {user: {username, first_name, last_name, phone, email}}
 *
 * If user cannot be found, return a 404 err.
 *
 */

router.get('/:username', authUser, requireLogin, async function(
  req,
  res,
  next
) {
  try {
    let user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username]
 *
 * Update user. Only the user themselves or any admin user can use this.
 *
 * It should accept:
 *  {first_name, last_name, phone, email}
 *
 * It should return:
 *  {user: all-data-about-user}
 *
 * It user cannot be found, return a 404 err. If they try to change
 * other fields (including non-existent ones), an error should be raised.
 *
 */
// BUG #2
// router.patch("/:username", authUser, requireLogin, requireAdmin, async function (req, res, next) {} )
router.patch('/:username', authUser, requireLogin, async function(
  req,
  res,
  next
) {
  try {
    if (!req.curr_admin && req.curr_username !== req.params.username) {
      throw new ExpressError('Only  that user or admin can edit a user.', 401);
    }

    // get fields to change; remove token so we don't try to change it
    let fields = { ...req.body };
    delete fields._token;
      // TESTS BUG #3
      // No validation was accepting anything need to add json schema that defines what can be changed 
      const validator = jsonschema.validate(fields, userPatchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new NotValidSchemaError(errs);
      }
    let user = await User.update(req.params.username, fields);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}); // end
//example of patch below {
// 	"_token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvZXdmciIsImFkbWluIjpmYWxzZSwiaWF0IjoxNjgzOTk3MjE2fQ.r6hG3eTFgqLxuid-3MM5Vt-NUJ2OrJIX7vjgv102yuY",
// 		"last_name": "seageefwr", 
// 	"passowrd": "daasdasd"

// }
/** DELETE /[username]
 *
 * Delete a user. Only an admin user should be able to use this.
 *
 * It should return:
 *   {message: "deleted"}
 *
 * If user cannot be found, return a 404 err.
 */

router.delete('/:username', authUser,  async function(
  req,
  res,
  next
) {
  try {
    //added await bug 5 
    await User.delete(req.params.username);
    return res.json({ message: 'deleted' });
  } catch (err) {
    return next(err);
  }
}); // end

module.exports = router;
