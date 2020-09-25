const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   
    id: { type:String, required: true},
    home: {
      id:  { type:String},
      abbreviation:  { type:String},
      logoUrl:  { type:String},
      },
    visitor: {
        id: { type:String},
        abbreviation: { type:String},
        logoUrl: { type:String},
      },
      finalResult: { type:String}   
   
});

module.exports = mongoose.model('Game', gameSchema);