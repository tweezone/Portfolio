pragma solidity ^0.4.24;

import "./AiWinCoin.sol";
import "../libraries/PredictionMarketInterface.sol";
import {StringsLib} from "../libraries/StringsLib.sol";

/// @title a sport game prediction market

contract PredictionMarket is PredictionMarketInterface {
  // owner is the address that send deployment transaction
  address _owner;
  bytes _marketContent; //game name, eg worldcup France vs England
  bytes32[] _options; //possible predictions eg.HomeWin, Draw, VistorWin.
  bytes32 _eventResult;
  uint _eventTime; //event start time
  uint _marketStartTime;
  uint _marketEndTime;

  uint _minPredictionAmount; //place amount
  uint _maxPredictionAmount;
  uint _minMarketAmount; //amount for a game of all pools
  uint _maxMarketAmount;

  //enum for market status
  enum MarketCondition {Open, Close, End} //start to accept bet(driven by datetime) //can't place bet, driven by datetime &market size //after distute fund, available for selfdestory
  MarketCondition _marketStatus;

  // when user place a bet, Prediction will be pushed in _market
  struct Prediction {
    address user;
    uint amount; //place for one option
  }
  Prediction predictCase;
  Prediction[] _pools; //array for preditions of one pool
  //option=> Amount, Amount means the total amount for each option pool
  mapping(bytes32 => uint) _totalPoolAmount;
  
  // option => pool eg:"HomeWin"->homeWinPool, "Draw"->drawPool,"VistorWin"->vistorWinpool
  mapping(bytes32 => Prediction[]) public _market;
  
  //raise predictionPlaced event in place()function
  uint public _totalMarketAmount;
  uint public _totalPredictCount; // total prediction placement
  event predictionPlaced(bytes32 option, address user, uint amount);
  
  //raise marketSettle event in setResult()function
  event marketSettle(bytes32 result, uint totalMarketamount);
  bytes fail; // for fall back funtion to handle wrong call parameter
  AiWinCoin aCoin; // aiwintoken contract

  /* constructor
	 * Create a instance of game contract.
	 * Time paramenters include date.
	 * Validate parameters
	 * - predictionEndTime must be later than predictionStartTime
	 * - max must be greater or equal to min
	 * setup owner. The creator will be the owner of this contract instance.
	 * initialize variables.
	 * marketContent: a game. For example, Raptor vs Lakers.
	 * options: possible predictions. For example, HomeWin, Draw, VistorWin. each option has one predition pool
	*/

    constructor(
    bytes marketContent,
    uint eventTime,
    bytes32[] options, // Throwing "StackTooDeepException"
    uint marketStartTime, 
    uint marketEndTime,    
    uint minPredictionAmount,
    uint maxPredictionAmount,
    uint minMarketAmount,
    uint maxMarketAmount,
    address aiWinaddr ) 
    public {
    _owner = msg.sender; //contract deployer is owner

    _marketContent = marketContent;
    _options = options;

    //use DateTime contract to precess Time
    _eventTime = eventTime;
   
    _marketStartTime = marketStartTime;
    _marketEndTime = marketEndTime;
    if (_marketStartTime >= _marketEndTime) revert(
      "start time should be earlier than end time"
    );

    if (minPredictionAmount >= maxPredictionAmount) revert(
      "MaxPredictionAmount should be bigger than min"
    );

    _minPredictionAmount = minPredictionAmount;
    _maxPredictionAmount = maxPredictionAmount;

    if (minMarketAmount >= maxMarketAmount) revert(
      "MaxMarketAmount should be bigger than min"
    );

    _minMarketAmount = minMarketAmount;
    _maxMarketAmount = maxMarketAmount;
    _marketStatus = MarketCondition.Open; //market open for bet?
    _totalMarketAmount = 0;
    aCoin = AiWinCoin(aiWinaddr); //set up Aiwincoin Contract

  }

  /**fallback function for wrong transaction or call */
  function() public payable {
    fail = msg.data;
  }
  function getFail() public view returns(bytes) {
    return fail;
  }

  modifier onlyOwner() {
    if (msg.sender != _owner) revert("only owner can execute the function");
    _;
  }
  
  /* set AiWinCoin contract address
   * @param aiWinAddress  from external dapp web3.js
   */
  function setAiwinCoinAddress(address aiWinAddress) external onlyOwner {
    aCoin = AiWinCoin(aiWinAddress);
  }

  /* validate the option parameter exist in options array.
   * place()  or setResult() will call it
   */

  function validOption(bytes32 option) public view returns(bool) {
    for (uint i = 0; i < _options.length; i++) {
      if (_options[i] == option) {
        return true;
      }
    }
    return false;
  }

  /**  place a prediction.
     * validate if market is open.
     * Validate if the user has enough fund.
     * Validate if the prediction is in pre-defined options.
     * add entry to a proper pool.
     *  update market total
     *  update pool total
     *  Raise prediction placed event;
     *  options: ['Home win', 'Draw', 'Visitor win']
    */
  function place(bytes32 option, uint pAmount) external returns(bool success) {
    //validate if maket is open,1 means open
    if (getMarketCondition() != 1) revert("Market is not open now!");
    require(getMarketCondition() == 1);
    //Validate if the user has enough fund
    uint aiWinAmount = aCoin.balanceOf(msg.sender);
    if (aiWinAmount < pAmount) revert(
      "Not enough AiWinCoin balance in your account!"
    );
    
    //valid option exist
    if (!validOption(option)) revert("this option doesn't exist!");

    //Validate pAmount between uint minPredictionAmount, uint maxPredictionAmount,
    if (pAmount < _minPredictionAmount) {
      revert("the prediction amount is too small");
    }
    if (pAmount > _maxPredictionAmount) revert(
      "the prediction amount is too big"
    );
  
    //validate maxMarketAmount not overflow
    uint nextMarketAmount = _totalMarketAmount + pAmount;
    if (nextMarketAmount > _maxMarketAmount) {
      setMaketClose(); //maxMarketAmount exceed, close market
      revert("Maximum marketAmount limitation exceed! ");
    }
           
     //aiwinCoin transfer from msg.sender to contract account
      if (!aCoin.transferFrom(msg.sender, address(this), pAmount)) revert(
        "place pet failed!"
      );
      
    // place prediction in market map.mapping ( bytes => Prediction[]) market;
    predictCase.user = msg.sender;
    predictCase.amount = pAmount;
    _market[option].push(predictCase);
    //_totalPoolAmount increase
    _totalPoolAmount[option] = SafeMath.safeAdd(
      _totalPoolAmount[option],
      pAmount
    );
    
    //update _totalMarketAmount
    _totalMarketAmount = nextMarketAmount;
    _totalPredictCount++;
    
    //Raise place event
    emit predictionPlaced(option, msg.sender, pAmount);
    return true;
  }

  function getPlacedBet(address account, bytes32 option) public view returns(uint[])
  {
    //create uint array for all the prediction placed amount
    //two way, memory uint[] or storage uint[];
    
     uint opLength = _market[option].length;
    
     if(opLength==0){      
       return;  
     }
     else{
      uint8 placeNums = 0;
      for (uint j = 0; j < opLength; j++){
        if ( _market[option][j].user == account){
            placeNums++;      
        }
      }
      
      //for
      //new memory array
       uint[] memory placeArr = new uint[](placeNums);
       for (uint k = 0; k < opLength; k++){
        if (_market[option][k].user == account){
           placeArr[k] = _market[option][k].amount; 
          
        }
      }//for 
      
      return placeArr; 
     }//if   
  }

  /* set game result
  *only the owner of the contract can set the game result.
  *Trigger prize distribution.
  *Raise market settle event;
  */
  function setResult(bytes32 result) external onlyOwner returns(bool success) {
    //  Validate if the reult is in pre-defined options.
    if (!validOption(result)) revert(
      "this result cannot match with any option!"
    );
    
    _eventResult = result; //save the result
    // calculate and  distribute aiwin coin
    distribute(result); 
    
    //Raise setResult event
    emit marketSettle(result, _totalMarketAmount);
    return true;

  }

  function getEventResult() public view returns(bytes32){
    return _eventResult;
  }

  /* distribute prize to winner
  *only owner can distribute prize.
  *calculate winner amount totalmoney
  */
  function distribute(bytes32 winOption) internal onlyOwner {
    uint winnerlenth = _market[winOption].length;
    if(winnerlenth==0){
       if (!aCoin.transfer(_owner, _totalMarketAmount)) revert(
        " No winner,distrube toal market aiwinToken to owner failed!"
      );
    }   //if(winnerlenth==0) 
    else{   
    //winner placed total amount
    uint winnerTotalPlaceAmount = _totalPoolAmount[winOption]; 
    uint a = 5;
    uint b = 100;
    uint lostAmount = _totalMarketAmount - winnerTotalPlaceAmount;
    address winner;
    if(lostAmount == 0){
      for (uint8 y = 0; y < winnerlenth; y++) {
       winner = _market[winOption][y].user;
       eachWinnerPlaceAmount = _market[winOption][y].amount;
       if (!aCoin.transfer(winner, eachWinnerPlaceAmount)) revert(
        "Nobody lost, tranfer money back to winner failed!"
      );//if
      }//for
    }// if(lostAmount == 0)   
    else{    
    //ownerAmount = lostamout*5%, owner get 5% of( _totalMarketAmount-winnerTotalPlaceAmount)
    uint ownerAmount = SafeMath.safeDiv(SafeMath.safeMul(lostAmount, a), b);

    uint winnerTotalDistributeAmount = SafeMath.safeSub(
      _totalMarketAmount,
      ownerAmount
    );

    uint eachWinnerPlaceAmount;
    uint winnerDistributAmount;
    //distribute aiwinToken to each winner
    for (uint8 j = 0; j < winnerlenth; j++) {
      winner = _market[winOption][j].user;
      eachWinnerPlaceAmount = _market[winOption][j].amount;
      
      //calculation:winnerTotalDistributeAmount*(eachWinnerPlaceAmount/winnerTotalPlaceAmount)
      uint interCalculate = SafeMath.safeMul(
        winnerTotalDistributeAmount,
        eachWinnerPlaceAmount
      );

      winnerDistributAmount = SafeMath.safeDiv(
        interCalculate,
        winnerTotalPlaceAmount
      );

      // aiwinCoin transfer(address to, uint tokens) public returns (bool success);
      if (!aCoin.transfer(winner, winnerDistributAmount)) revert(
        "distrube aiwinToken to winner failed!"
      );      
     
      }//for
       if (!aCoin.transfer(_owner, ownerAmount)) revert(
        "distribute aiwinToken for 5% processing fee to owner failed!"
      );
    }// if(lostAmount == 0) else end         
  }////if(winnerlenth==0)else end
     //set _marketStatus to end, ready for killing contract (selfdestruct)
     _marketStatus = MarketCondition.End;
  }

  function getMarketAmount() public view returns(uint) {
    return _totalMarketAmount;
  }

  function getPoolAmount(bytes32 option) public view returns(uint) {
    uint plen = _market[option].length;
    uint poolSum = 0;
    for (uint8 i = 0; i < plen; i++) {
      poolSum = poolSum + _market[option][i].amount;
    }
    return poolSum;
  }

  function getMarketStartTime() public view returns(uint) {
    return _marketStartTime;
  }

  function getMarketEndTime() public view returns(uint) {
    return _marketEndTime;
  }
  /**get market condition open/close/End
  * @return condition 1 open 2 close 3 end
   */
  function getMarketCondition() public view returns(uint8) {
    uint8 condition = 0;
    if (_marketStatus == MarketCondition.Open) condition = 1;
    else if (_marketStatus == MarketCondition.Close) condition = 2;
    else if (_marketStatus == MarketCondition.End) condition = 3;
    return condition;
  }
  function setMaketClose() internal {
    _marketStatus = MarketCondition.Close;
  }

  //selfdestruct(owner)
  function kill() external onlyOwner {
    if (address(this).balance != 0){
     if (!aCoin.transfer(_owner, address(this).balance)) revert(
        "distribute remained aiwinToken to owner before killing this contract failed!"
      );
    }
    //check marketStatus is end
    if (_marketStatus == MarketCondition.End) {
      selfdestruct(msg.sender); //
    } else revert("market not end, can not kill it yet!");
  }
}
