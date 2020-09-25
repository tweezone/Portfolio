// Modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Routes
const leaguesRoutes = require("./routes/leagues");
const gamesRoutes = require("./routes/games");
const sportsRoutes = require("./routes/sports");

const usersRoutes = require("./routes/users");

const betsRoutes = require("./routes/bets");


const app = express();

var mongoDB = 'mongodb://worldcupappdev:World!cup%40pp@buildmaster.eastus.cloudapp.azure.com:27017/worldcupdb-dev';

//var mongoDB = 'mongodb://127.0.0.1:27017/world-cup';
mongoose.connect(mongoDB, { 
   // uri_decode_auth: true ,
        useNewUrlParser: true
    },function(error) {
        // Check error in initial connection. There is no 2nd param to the callback.
        console.log(error);
      });

mongoose.Promise = global.Promise;
/*Use app.use if you want to add some middleware 
(a handler for the HTTP request before it arrives to the routes you've set up in Express),
 or if you'd like to make your routes modular 
*/

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());  //for request post json


app.use((req,res,next)=>{                      //To prevent CORS error
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
         "Origin,X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST,GET');
        return res.status(200).json({});
    }
    next();
})

// Api

app.use("/leagues", leaguesRoutes);
app.use("/games", gamesRoutes);
app.use("/sports",sportsRoutes);

app.use("/users",usersRoutes);

app.use("/bets", betsRoutes);





module.exports = app;
