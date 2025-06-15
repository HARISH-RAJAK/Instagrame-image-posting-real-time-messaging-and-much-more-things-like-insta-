
var express = require('express');
var router = express.Router();
const userModel = require('../routes/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('../routes/multer');
const user = require('../routes/user');
const postModel = require('../routes/post');
passport.use(new localStrategy(userModel.authenticate()));



router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/post', isLoggedIn, function (req, res) {
    res.render('post');
});

router.get('/', function (req, res, next) {
    res.render('register');
});


router.get('/profile', isLoggedIn, async function (req, res, next) {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const post = await postModel.find().populate("user");
    const  filter_data =  postModel.find({ "user" : user._id });
    const count_post = await filter_data.countDocuments();
    res.render('profile', { user,post,count_post});
});

router.get('/register', function (req, res, next) {
    res.render('register');
});

router.get('/search', isLoggedIn , function(req,res){
res.render('search');
});

router.get('/username/:username',isLoggedIn, async function(req,res){
const regex = new RegExp(`^${req.params.username}`,'i');
const user = await userModel.find({username : regex});
res.json(user);

});

router.get('/home', isLoggedIn, async function (req, res, next) {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const post = await postModel.find().populate('user');
    const count = await postModel.countDocuments();
    res.render('home', { user ,post,count });
});

router.get('/edit', isLoggedIn,async function (req, res, next) {
    const user = await userModel.findOne({ username: req.session.passport.user })
    res.render('edit', { user });
});

router.post('/post', upload.single('postimg'), isLoggedIn, async function (req, res) {
    try {
        if (!req.file || !req.body.title) {
            return res.status(400).send('Missing file or title.');
        }

        const user = await userModel.findOne({ username: req.session.passport.user });

        const postData = await postModel.create({
            picture: req.file.filename,
            user: user._id,
            title: req.body.title,
        });

        user.posts.push(postData._id);
        await user.save();

        res.redirect('/profile');
    } catch (error) {
        console.error("Post upload failed:", error);
        res.status(500).send("Something went wrong.");
    }
});

router.post('/post', upload.single('postimg'), isLoggedIn, async function (req, res) {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const postData = await postModel.create({
         picture : req.file.filename,
         user : user._id,
         title : req.body.title,
    });
    user.posts.push(postData._id);
    await user.save();
    
    res.redirect('/profile');
});

router.post('/edit', upload.single('profilePic'), async function (req, res, next) {
    const user = await userModel.findOneAndUpdate(
        { username: req.session.passport.user },
        {
            fullname: req.body.fullname,
            username: req.body.username,
            bio: req.body.bio,
            website: req.body.website,
            hobby: req.body.hobby
        },
        { new: true }
    );
    if (req.file) {
        user.profileImage = req.file.filename;
    }

    await user.save();
    res.redirect('/profile');
});


router.post('/register', function (req, res, next) {
    const UserData = new userModel({
        username: req.body.username,
        email: req.body.email,
    });
    userModel.register(UserData, req.body.password)
        .then(function () {
            passport.authenticate('local')(req, res, function () {
                res.redirect('/profile');
            });
        });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
}), function (req, res) {
    res.render('login');
});

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

module.exports = router;
