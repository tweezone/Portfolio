pragma solidity ^0.4.24;

/**
 * Math operations with safety checks
 */
library SafeMath {
  function safeMul(uint256 a, uint256 b) internal pure returns(uint256) {
    uint256 c = a * b;
    assertMath(a == 0 || c / a == b);
    return c;
  }

  function safeDiv(uint256 a, uint256 b) internal pure returns(uint256) {
    assertMath(b > 0);
    uint256 c = a / b;
    assertMath(a == b * c + a % b);
    return c;
  }

  function safeSub(uint256 a, uint256 b) internal pure returns(uint256) {
    assertMath(b <= a);
    return a - b;
  }

  function safeAdd(uint256 a, uint256 b) internal pure returns(uint256) {
    uint256 c = a + b;
    assertMath(c >= a && c >= b);
    return c;
  }

  function assertMath(bool assertion) internal pure {
    if (!assertion) {
      revert("Math calulation failed!");
    }
  }
}
