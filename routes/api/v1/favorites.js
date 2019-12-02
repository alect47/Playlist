var express = require('express');
var forecast = require('./forecast');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

const helpers = require('../../../application_helper/helper_functions');
const fetchForecast = helpers.fetchForecast;
const fetchForecastFav = helpers.fetchForecastFav;

module.exports = router;
