const checkPhone = new RegExp("^[789]\d{9}$");
const _ = require('lodash');
const validOTP = num => {
    return _.isNumber(num) && _.toString(num).length === 5 ;
}

function fillZero(num, length) {
    num = num.toString();
    while (num.length < length) num += "0";
    return num;
  }

function getRandomOTP() {
    upper = 99999;
    const otp = Math.floor(Math.random() * (upper + 1));
    return fillZero(otp, 5);
}
module.exports = {checkPhone, getRandomOTP, validOTP};