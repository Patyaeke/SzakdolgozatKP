const { panaszSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Panasz = require('./models/panasz');
const Review = require('./models/review');





module.exports.isLoggedIn = function(req, res, next){
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Először be kell jelentkeznie!');
        return res.redirect('/login');
    }
    next();
};



module.exports.validatePanasz = function(req, res, next){
    const { error } = panaszSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};




module.exports.isAuthor = async function(req, res, next){
    const { id } = req.params;
    const panasz = await Panasz.findById(id);
    if (panasz.author.equals(req.user._id) || req.user.isAdmin) {
next();
}else{
        req.flash('error', 'Ehez a művelethez nincsen megfelelő joga');
        return res.redirect(`/panaszok/${id}`);
    }

};


module.exports.isReviewAuthor = async function(req, res, next){
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (review.author.equals(req.user._id) || req.user.isAdmin) {
        next();
    }else{

    req.flash('error', 'Ehez nincsen megfelelő joga.');
    return res.redirect(`/panaszok/${id}`);
  }
};



module.exports.validateReview = function(req, res, next){
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};
