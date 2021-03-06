const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;





const PanaszSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    termek: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});



PanaszSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});


module.exports = mongoose.model('Panasz', PanaszSchema);
