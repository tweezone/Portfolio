// Positive Decimals or Positive integers or Zero(0)
const isP0_number = RegExp(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)|[0]{1,1})$/);

// Positive Decimals or Positive integers
const isP_number = RegExp(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/);

//Positive Integer or Zero(0)
const isP0_integer = RegExp(/^([1-9]\d*|[0]{1,1})$/);

// Positive Integer
const isP_integer = RegExp(/^[0-9]*[1-9][0-9]*$/);



module.exports={ 
    isP0_number, 
    isP_number,
    isP0_integer,
    isP_integer,
}
