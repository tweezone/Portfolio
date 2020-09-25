const express = require("express");
var fs = require("fs");
const mongoose = require('mongoose');

const Sport = require('../models/sport');
const Bet = require('../models/bet');

const router = express.Router();

/*
// post /sports/bet save to mongodb DB

router.post('/bet', (req,res,next)=>{
  
    
    const bet = new Bet( {
        _id: new mongoose.Types.ObjectId(),
        id: req.body.id,
        user: req.body.user,
        predictionMarket: req.body.predictionMarket,
        game: req.body.game,
       prediction: req.body.prediction,
        betAmount: req.body.betAmount,
        betResult: req.body.betResult,
        betResultAmount: req.body.bestResultAmount
       
    } )
     
    bet
    .save()
   
    .then(result => {
        console.log(result);
        res.status(201).json({
            message:'handling post requests to /sports/bet',
            createdBet: {
                user: result.user,
                prediction: result.prediction,
                betAmount: result.betAmount,
                betResult: result.betResult,
                betResultAmount: result.betResultAmount,              
                _id: result._id,
                request:{
                    type: "POST",
                   }

            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    } );

   
});
*/

//get /sports ,read file sport.json from world-cup-api directory, need require'fs'
router.get('/', (req, res,next) => {	
   // var content=fs.readFileSync('server/models/GetSportsLeagueSeason_ResponseMsg.json', 'utf8');
   var content=fs.readFileSync('server/models/GetSports_ResponseMsg.json', 'utf8');
   
  //  var sports = JSON.parse(content);
	res.status(200).send(content);
   
});

//get /sports/nba/2018-2019 --> Sample_GameSchedule_NBA.json
router.get('/nba/2018-2019', (req, res,next) => {	
    var content=fs.readFileSync('server/models/GetSportsLeagueSeason_ResponseMsg_NBA-2018-2019.json', 'utf8');
  //  var sports = JSON.parse(content);
	res.status(200).send(content);
   
});


//get /sports/nfl/2018-2019 --> Sample_GameSchedule_NFL.json

router.get('/nfl/2018-2019', (req, res,next) => {	
    //var content=fs.readFileSync('server/models/Sample_GameSchedule_NFL.json', 'utf8');
    var content=fs.readFileSync('server/models/GetSportsLeagueSeason_ResponseMsg_NFL-2018-2019.json', 'utf8');
    
  //  var sports = JSON.parse(content);
	res.status(200).send(content);   
});


//get /sports/epl/2018-2019 --> Sample_GameSchedule_EPL.json

router.get('/epl/2018-2019', (req, res,next) => {	
    var content=fs.readFileSync('server/models/GetSportsLeagueSeason_ResponseMsg_EPL-2018-2019.json', 'utf8');
  //  var sports = JSON.parse(content);
	res.status(200).send(content);   
});



 //get /sports data from mongodb
/*
router.get('/',(req,res,next)=>{
    Sport.find()

    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            sports: docs.map(doc => {
                return {
                    id: doc.id,
                    leagueName: doc.leagueName,
                    leaugeAbbreviation: doc.leaugeAbbreviation,
                    tags: doc.tags,
                    leagueLogoLink: doc.leagueLogoLink,
                    country: doc.country,
                   
                   request: {
                        type: 'GET',
                        url: 'http://../sports/'+doc.id
                    }
                    
                }
            })
        }
        console.log(docs);
        if(docs.length >= 0){
         res.status(200).json(response);   
        }else{
            res.status(404).json({
                message: 'No data found'
            })
        }
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
   
 });

*/

module.exports = router;