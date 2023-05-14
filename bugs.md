
### BUG 1:
	
#### GET/:username Route

 If user cannot be found, return a 404 err issue is the code currently only had the error it didnt have a call to it so need to return the error
	
- Bug: Was returning an empty object  on the User.get(username) method

	  if (!user) {
		new ExpressError('No such user', 404);
      }
- Solution: return added to stop the code and return the error

	  if (!user) {
		return new ExpressError('No such user', 404);
      }
	

# 2 BUG 2:

## on the Patch route for users a logged in user can not adjust their own profile, because of the  requireAdmin so I removed this to allow user to make modifications to their own. 

- Bug : router.patch('/:username', authUser, requireLogin, requireAdmin, async function 
- Because of requireAdmin you wont be able to make modifications to your own profile, theres already an or statement in the line 72 which says user must either be making modifications to their own profile or it must be req.curr_admin

-Solution: 
router.patch('/:username', authUser, requireLogin, async function(


# 3 BUG 3:
-Need to add json schema to prevent users from changing other fields besides first name, last name, phone and email 
-Bug: patch route accepting any value 
-Solution: Insert json schema which produces error if unexpected value is passed in.

# 4  Bug 

-Added await to auth/login post route 

# 5 Bug added await to user.delete

-Bug- Initially was just  user.delete without an await 

# 6 bug 6 issue on let payload - jwt.decode(token)
--Solution    let payload = jwt.verify(token, SECRET_KEY);
### 8- Not sure if this is one of the bugs but , 
module.exports = app; was included twice so removing the extra one. 

### 9- so on user getAll in the models I dont know why you would pass username and password when its not being used in the model so I removed username and password from User.getAll route in the model. 

## 7 - More of security thing but I removed req.query._token from authUser I dont think you should be passing in the token in the query 
function authUser(req, res, next) {
  try {
    const token = req.body._token || req.query._token;

	Removed req.query._token 

 <!-- INSERT INTO users (username, first_name, last_name, email, phone, password, admin) VALUES ('samsam', 'samiam', 'l
amdam','dododo@aol.com', '5634562345', 'dfododod', false)
{ "username" : "bobseager", "password" : "bobseager39", 
 "first_name": "bobby", "last_name": "seager", 
 "email": "bobbyseags@aol.com", "phone": "6562652656" } -->


 <!-- INSERT INTO users (username, first_name, last_name, email, phone, password, admin) VALUES ('wong', 'wongpoing', 'madam','do@gmail.com', '911', 'conor', true) -->