const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');





router.get('/register',function (req, res)  {
    res.render('users/register');
});




router.post('/register', catchAsync(async function(req, res, next) {
    try {

        const { email, username, password, } = req.body;
        const user = new User({ email, username ,});
if(req.body.username === 'admin')
{user.isAdmin = true };
const registeredUser = await User.register(user, password);
        req.login(registeredUser, function(err) {
            if (err) return next(err);
            req.flash('success', 'Szívesen látnánk a véleményét');
            res.redirect('/panaszok');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));




router.get('/login', function (req, res) {
    res.render('users/login');
});


router.post('/login', passport.authenticate('local', { failureFlash:true, failureRedirect: '/login' }), function(req, res) {
    req.flash('success', 'Üdvözöljük');
    const redirectUrl = req.session.returnTo || '/panaszok';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});


router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', "Viszont látásra!");
    res.redirect('/panaszok');
});

module.exports = router;
