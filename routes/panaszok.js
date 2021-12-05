const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePanasz, } = require('../middleware');

const Panasz = require('../models/panasz');

router.get('/', isLoggedIn, catchAsync(async function(req, res) {
    const panaszok = await Panasz.find({});
    res.render('panaszok/index', { panaszok })
}));

router.get('/new', isLoggedIn, function(req, res) {
    res.render('panaszok/new');
})


router.post('/', isLoggedIn,  validatePanasz, catchAsync(async function(req, res, next)  {
    const panasz = new Panasz(req.body.panasz);
    panasz.author = req.user._id;
    await panasz.save();
    req.flash('success', 'A vásárlói visszajelzés sikeresen elmentve!');
    res.redirect(`/panaszok/${panasz._id}`)
}));

router.get('/:id', catchAsync(async function(req, res,){
    const panasz = await Panasz.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(panasz);
    if (!panasz) {
        req.flash('error', 'Visszajelzés nem található');
        return res.redirect('/panaszok');
    }
    res.render('panaszok/show', { panasz });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async function(req, res) {
    const { id } = req.params;
    const panasz = await Panasz.findById(id)
    if (!panasz) {
        req.flash('error', 'Ez a vásárlói visszajelzés nem található');
        return res.redirect('/panaszok');
    }
    res.render('panaszok/edit', { panasz });
}));

router.put('/:id', isLoggedIn, isAuthor, validatePanasz, catchAsync(async function (req, res) {
    const { id } = req.params;
    const panasz = await Panasz.findByIdAndUpdate(id, { ...req.body.panasz});
    req.flash('success', 'A vásárlói visszajelzés frissítve');
    res.redirect(`/panaszok/${panasz._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async function(req, res) {
    const { id } = req.params;
    await Panasz.findByIdAndDelete(id);
    req.flash('success', 'A vásárlói visszajelzés törölve.')
    res.redirect('/panaszok');
}));

module.exports = router;
