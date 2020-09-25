const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const bcrypt = require('bcrypt'); //to hash password

const jwt = require('jsonwebtoken');

const User = require('../models/user');


router.post('/login', (req, res,next)=>{
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if(user === null){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        if (user.validPassword(req.body.password)) {
            return res.status(201).send({
                message : "User Logged In",
            });
        }
     /*   bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result){
                const token = jwt.sign({
                    email:  user.email,
                    userId: user._id
             //   }, process.env.JWT_KEY, {  //nodemon.json doesn't work well now
            }, 'secret', {
                    expiresIn: "1h"
                })
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        }); */
    })
    
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err});
        }
    )
});

router.post('/signup', (req, res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length>=1){
            return res.status(409).json({
                message: 'Email exists'
            });
        } else {
            const newUser = new User({
                _id: new mongoose.Types.ObjectId()                             
                });
                newUser.email = req.body.email;   
                newUser.setPassword(req.body.password);

                newUser
                .save()
                .then(result =>{
                    console.log(result);
                    res.status(201).json({
                        message: 'User created'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                })
           }
            })   
});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'user deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})
module.exports = router;