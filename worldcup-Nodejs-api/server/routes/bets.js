const express = require("express");
const router = express.Router();
const Bet = require('../models/bet');
const mongoose = require('mongoose');

//get mybets, query bets collection with userId and send response with bets array.
router.get('/:userId',(req,res,next)=>{

      Bet.find({'user': req.params.userId})
     //  .populate('game')
     .exec()
     .then(bet => {
         if(bet.length >= 0) {
            res.status(200).json({
                bet: bet,
                request: {
                    type: 'GET'              
                }
            });
       
         }else{

            return res.status(404).json({
                message: "bets not found"
            })
         }
        })
     .catch(err =>{
         res.status(500).json({
             error: err
         });
     });
});



// post /sports/bet save to mongodb DB

router.post('/', (req,res,next)=>{  
    
  const bet = new Bet( {
      _id: new mongoose.Types.ObjectId(),
     // id: req.body.id,
      user: req.body.userId,
   //   predictionMarket: req.body.predictionMarket,
      game: req.body.gameId,
     prediction: req.body.prediction,
      betAmount: req.body.betAmount,
    //  betResult: req.body.betResult,
   //   betResultAmount: req.body.bestResultAmount
     
  } )
   
  bet
  .save()
 
  .then(result => {
      console.log(result);
      res.status(201).json({
          message:'handling post requests to /bets',
          createdBet: {
              user: result.user,
          //    prediction: result.prediction,
              betAmount: result.betAmount,
          //    betResult: result.betResult,
           //   betResultAmount: result.betResultAmount,              
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


module.exports = router;