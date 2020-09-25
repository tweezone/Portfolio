const mongoose = require('mongoose');

const betSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id:{ type:String},
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    predictionMarket: {
      id: { type:String},
      contract: { type:String},
    },
  game: {
    type: mongoose.Schema.Types.ObjectId, ref:'Game', required: true
    },
    prediction:  { type:String, required: true},
    betAmount: { type:Number, required: true}, 
    betResult: { type:String},
    betResultAmount: { type:Number}   
  
});

module.exports = mongoose.model('Bet', betSchema);