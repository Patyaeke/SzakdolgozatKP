
const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor, } = require('../middleware');
const Panasz = require('../models/panasz');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');







router.post('/', isLoggedIn, validateReview, catchAsync(async function(req, res){
    const panasz = await Panasz.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    panasz.reviews.push(review);
    await review.save();
    await panasz.save();
    req.flash('success', 'Új hozzászólás elküldve');
    res.redirect(`/panaszok/${panasz._id}`);
}));







router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async function(req, res){
    const { id, reviewId } = req.params;
    await Panasz.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Hozzászólás törölve')
    res.redirect(`/panaszok/${id}`);
}));




module.exports = router;
