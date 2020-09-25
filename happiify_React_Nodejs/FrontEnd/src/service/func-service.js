/*
* Purpose: Make the order (ascending order) of an object array. The type of parameter is "number" or "string".
* Used By: Addproduct.js
*/ 
function compare(property){
    return (obj1,obj2)=>{
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2;             // Ascending order
    }
}
const object_array_compare=(data, property)=>{
    return data.sort(compare(property));
}

/*
* Purpose: Get some property's array from a object array.
* Used By: Addproduct.js
*/ 
const propArray=(objectArray, propString)=>{
    let propertyArray=[];
    if(objectArray.length!==0){
        objectArray.forEach(one=>{
            propertyArray.push(one[propString]);
        })
    }
    return propertyArray
}

/*
* Purpose: Deep copy an object array.
* Used By: SelectLocation.js
*/ 
const objDeepCopy=(source)=>{
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}

const getUTCTimeString=(timeString)=>{
    let UTCTimeString ='';
    if(timeString.length !== 0){
        const DBdate = new Date(timeString).getTime();          // 数据库距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
        const offset_GMT = new Date().getTimezoneOffset();      //本地时间和格林威治的时间差，单位为分钟
        const FEdate = new Date(DBdate - offset_GMT*60*1000);
        UTCTimeString =  FEdate.toISOString();
    }
    return UTCTimeString;    
}

export { object_array_compare, propArray, objDeepCopy, getUTCTimeString }
