// Use for upload files to get the date string.
const getNowFormatDate = ()=> { 
    var date = new Date();
    var seperator1 = "-"; 
    var month = date.getMonth() + 1; 
    var strDate = date.getDate(); 
    if (month >= 1 && month <= 9) { 
        month = "0" + month; 
    } 
    if (strDate >= 0 && strDate <= 9) { 
        strDate = "0" + strDate; 
    } 
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate; 
    return currentdate.toString(); 
};

// Use for change single quotations and some weird HTML field in the data sent from front end.
const handleSpecialChar = ( data )=>{
    for(let prop in data){
        if(typeof(data[prop]) === 'string'){
            data[prop] = data[prop].replace(/'/gi, "\\'").replace(/(font-family.*?)[^>]*/gi, '"');
        }
    }
    return data
};

module.exports={ getNowFormatDate, handleSpecialChar };

