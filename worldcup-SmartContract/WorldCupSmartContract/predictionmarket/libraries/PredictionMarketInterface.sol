pragma solidity ^0.4.22;
contract PredictionMarketInterface {
  function place(bytes option, uint amount) external;
  function setResult(bytes result) external;
  function getMarketAmount() public view returns(uint);
  function getPoolAmount(bytes option) public view returns(uint);
  function getMarketStartTime() public view returns(uint);
  function getMarketEndTime() public view returns(uint);
  // function getPlacedPrediction()public view returns(mapping);
  // function getMarketCondition() public view returns(bytes);//???enum MarketCondition returns bytes??
  function isMarketClosed() public view returns(bool);
  function isMarketOpen() public view returns(bool);
  function isMarketEnd() public view returns(bool);

}
