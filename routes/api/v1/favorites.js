var express = require('express');
// var favorite = require('./favorite');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

const helpers = require('../../../services/musixService');
const fetchForecast = helpers.fetchMusic;

module.exports = router;
