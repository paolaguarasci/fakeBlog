# 🔥🔥🔥 FakeBlog 🔥🔥🔥
### A Fake blog with CRUD and registration user
the peculiarity of this exercise is that I'm using the libraries but I'm not using any framework or high-level libraries, which do what I need in a few lines of code. I'm trying to keep myself at the lowest level I can. Without falling into the tedium of *_really_doing_everything_by_hand_*.

### Stack
The main components are: **Node**, **Express** (with session and router) and **PostgresSQL** and its driver for node. That's all. Off course, the security part should be reviewed and probably I will eventually use something like passport.js, but it will still be a next step, with the blog fully functional blog!

### What can i do (now)?
- ✅ read latest 20 post in homepage
- ✅ login using form
- ✅ add post as logged user
- ✅ update my posts as logged user
- ✅ view only my post as logged user
- ✅ click buttons to delete or mod post
- ✅ signup into platform using registration form
- ✅ change my user information

### TODO
- ~~make editable user info~~
- ~~make profile.html with only users logged post and info~~
- ~~make modPost.html for update posts~~
- ~~make interface with some button (delete, update...)~~ 🤔
- ~~make registration.html~~
- Ajax for better user exp
- Cookie? I want to save session
- Check data on client side (like form validation)
- Refactoring follow MVC style

### Maybe one day...
- Security policy
  ✅ now in db is stored only hash string