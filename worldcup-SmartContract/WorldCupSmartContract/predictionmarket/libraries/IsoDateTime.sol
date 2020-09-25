pragma solidity ^0.4.16;

library IsoDateTime {
  function get(string isoDatetime) public returns(
    uint16 year,
    uint8 month,
    uint8 day,
    uint8 hour,
    uint8 minute,
    uint8 offsetHour,
    uint8 offsetMinute,
    bool hasTimeZone
  ) {
    // input format 1981-04-05T15:00-05:00
    // Seperate date from time
    var s = isoDatetime.toSlice();

    var delim = "T".toSlice();
    var parts = new string[](s.count(delim) + 1);
    uint8 i;
    for (i = 0; i < parts.length; i++) {
      parts[i] = s.split(delim).toString();
    }

    // 1981-04-05
    var tempPart0 = parts[0];
    var tempPart1 = parts[1];

    //Parse date parts to year, month and day
    s = tempPart0.toSlice();
    delim = "-".toSlice();
    parts = new string[](s.count(delim) + 1);
    for (i = 0; i < parts.length; i++) {
      parts[i] = s.split(delim).toString();
    }

    year = uint16(parseInt(parts[0], 0));
    month = uint8(parseInt(parts[1], 0));
    day = uint8(parseInt(parts[2], 0));

    //Seperate timeParts to time and time zone offset.
    //15:00-05:00
    s = tempPart1.toSlice();
    delim = "-".toSlice();
    parts = new string[](s.count(delim) + 1);
    for (i = 0; i < parts.length; i++) {
      parts[i] = s.split(delim).toString();
    }

    // Datetime 15:00
    tempPart0 = parts[0];

    if (parts.length == 2) {
      tempPart1 = parts[1];
      hasTimeZone = true;
    }

    //Parse hour and minute
    // 15:00
    s = tempPart0.toSlice();
    delim = ":".toSlice();
    parts = new string[](s.count(delim) + 1);
    for (i = 0; i < parts.length; i++) {
      parts[i] = s.split(delim).toString();
    }

    hour = uint8(parseInt(parts[0], 0));
    minute = uint8(parseInt(parts[1], 0));

    if (hasTimeZone) {
      //Parse time offset in hours and minutes
      s = tempPart1.toSlice();
      delim = ":".toSlice();
      parts = new string[](s.count(delim) + 1);
      for (i = 0; i < parts.length; i++) {
        parts[i] = s.split(delim).toString();
      }

      offsetHour = uint8(parseInt(parts[0], 0));
      offsetMinute = uint8(parseInt(parts[1], 0));
    }
  }

  function parseInt(string _a, uint _b) internal returns(uint) {
    bytes memory bresult = bytes(_a);
    uint mint = 0;
    bool decimals = false;
    for (uint i = 0; i < bresult.length; i++) {
      if ((bresult[i] >= 48) && (bresult[i] <= 57)) {
        if (decimals) {
          if (_b == 0) break;
          else _b--;
        }
        mint *= 10;
        mint += uint(bresult[i]) - 48;
      } else if (bresult[i] == 46) decimals = true;
    }
    return mint;
  }
}
