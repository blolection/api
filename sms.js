
const {msg91Token} = require('./config');

const msg91 = require('msg91-promise');

const API_KEY = msg91Token; // Your API key
const SENDER_ID = 'BLELEC'; // Your sender id 
const ROUTE = 4; // transactional route

const msg91SMS = msg91(API_KEY, SENDER_ID, ROUTE);

module.exports = msg91SMS;