var PredictionMarket = artifacts.require("../contracts/PredictionMarket.sol");


contract('PredictionMarket', function(accounts) {
  it("should return toalMarket Amount", function() {
    return PredictionMarket.deployed().then(function(instance) {
      return instance.getMarketAmount.call();
    }).then(function(amount) {     
          var initialAmount = 0;
          console.log(amount.toNumber());
      assert.equal(amount.valueOf(), initialAmount, "good! _totalMarketAmount initialized to 0");     
    });
  });

  it("valid option Draw exist", function() {
    return PredictionMarket.deployed().then(function(instance) {
      return instance.validOption.call("Draw");     
    }).then(function(exist){
      console.log(exist);
     assert.isTrue(exist,'option exist');
    });
   });   
  
 
  it("should place prediction msg.sender and amount", function() {
      return PredictionMarket.deployed().then(function(instance) {      
         return instance.place('Draw',100);        
        })
               
       .then(function(result,totalPredictCount) {
        /* result is an object with the following values:      
         result.tx      => transaction hash, string
         result.logs    => array of decoded events that were triggered within this transaction
         result.receipt => transaction receipt object, which includes gas used      
         We can loop through result.logs to see if we triggered the Transfer event.
        */
        console.log(totalPredictCount);
        console.log(result.logs);
        for (var i = 0; i < result.logs.length; i++) {
          var log = result.logs[i];
      
          if (log.event == "predictionPlaced") {
            // We found the event!
            console.log("event predictionPlaced succesfully emitted!");
            break;
          }
        }
      })
        .catch(function(err) {
          // There was an error! Handle it.
          console.log(err);
        });
         
        }); //it    

  });  //contract   
  
  

/*
  it("should send coin correctly", function() {
    var coin;

    // Get initial balances of first and second account.
    var account_one = web3.eth.accounts[0];
    var account_two = web3.eth.accounts[1];
    console.log("account_one address is ");
    console.log(accounts[0]);
	
    console.log("account_two address is ");
    console.log(accounts[1]);

    var account_one_starting_balance; 
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 9000000000000000000;

    return AiWinCoin.deployed().then(function(instance) {
      console.log(" deployed ");
      coin = instance;
      return coin.balanceOf.call(account_one);
    }).then(function(balance) {
	   console.log("account one starting balance is  " + balance);
      account_one_starting_balance = balance.toNumber();     

      return coin.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      console.log("account two starting balance is  " + balance);
      return coin.transfer.call(account_two, amount);
    }).then(function() {
      return coin.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
	  console.log("account one ending balance is  " + balance);
      return coin.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();
      console.log("account two ending balance is  " + balance);
	  
      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

 it("should get year, month and day from iso Datetime string", function() {
	var isoDateTime = "1988-04-05T15:30-05:00";
        console.log("test input is " + isoDateTime);
	return AiWinCoin.deployed().then(function(instance) {
		console.log(" deployed ");
      		coin = instance;
      		return coin.get.call(isoDateTime);
 	 }).then(function(result){
		console.log("year is " + result[0].toString());
		console.log("month is " + result[1].toString());
		console.log("day is " + result[2].toString());
	        console.log("hour is " + result[3].toString());
	        console.log("minute  is " + result[4].toString());
                console.log("timeZoneOffHour  is " + result[5].toString());
	        console.log("timeZoneOffminute  is " + result[6].toString());
	        console.log("has time Zone?  " + result[7].toString());
                assert.equal(result[0], 1988, "The year should be 1981");
		assert.equal(result[1], 4, "The month should be 4");
		assert.equal(result[2], 5, "The day should be 5");
		assert.equal(result[3], 15, "The hour should be 15");
                assert.equal(result[4], 30, "The minute should be 30");
	});
  });
*/

