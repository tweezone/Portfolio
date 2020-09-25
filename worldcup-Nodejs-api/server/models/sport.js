const mongoose = require('mongoose');
const sportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id:{type:Number, required: true},
    leagueName: { type:String, required: true},
    leagueAbbreviation: { type:String, required: true},
    leagueNames: { type: Array, },
    leagueAbbreviations: { type:Array, },
    tags: { type:String, required: true},
    tagsLanguages:{type: Array},
    leagueLogoLink: { type:String},
    country: { type:String, required: true}
    

});

module.exports = mongoose.model('Sport', sportSchema);