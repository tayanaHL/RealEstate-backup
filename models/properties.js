
const mongoose = require('../utils/connection')

const commentSchema = require('./comment')

const { Schema, model } = mongoose


const propertySchema = new Schema({
    location: {
        type: String
    },
    images: {
        type: String
    },
    forSale: {
        type: Boolean
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    owner: {
       
        type: Schema.Types.ObjectId,
       
        ref: 'User'
    },
	comments: [commentSchema]
}, { timestamps: true })


const Property = model('Property', propertySchema)


module.exports = Property