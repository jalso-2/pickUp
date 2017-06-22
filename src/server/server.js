require('dotenv').config();
import moment from 'moment';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import db from './mongoose/dbConnect';
import gameController from './games/gameController';
import sms from './twilio/sms';
import cronMsg from './cron/cronMessageTask';
import cronDel from './cron/cronDeleteTask';

const chrono = require('chrono-node');
const twilio = require('twilio');
const axios = require('axios');
const stringSimilarity = require('string-similarity');

const sports = ['soccer', 'basketball', 'baseball', 'football', 'volleyball'];

const app = express();
let clientDir = path.join(__dirname, '../../src/client')

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(clientDir));

app.post('/api/games', gameController.addRequest)
console.log(`client directory: ${clientDir}`)

app.post('/sms', (req, res) => {
  const phoneNum = req.body.From;
  // console.log(req.body.From, 'body of request');
  const mes = req.body.Body;
  console.log('this is message', mes);
  var guessPMRefiner = new chrono.Refiner();
  guessPMRefiner.refine = function(text, results, opt) {
      results.forEach(function (result) {
          if (!result.start.isCertain('meridiem') 
              &&  result.start.get('hour') >= 1 && result.start.get('hour') < 4) {
              
              result.start.assign('meridiem', 1);
              result.start.assign('hour', result.start.get('hour') + 12);
          }
      });
      return results;
  } 
  var custom = new chrono.Chrono();
  custom.refiners.push(guessPMRefiner);
  const date = custom.parseDate(mes);
  let readable = date.toString();
  console.log(date, 'this is date and time')
  
  if(date === null) {
    sms.sendError(phoneNum, 'Sorry, we were unable to understand the date/time for your event. Please send a new request.');
    res.sendStatus(500);
    return;
  }
  axios.get(`http://geocoder.ca/${req.body.Body}?json=1?auth=10301591512318965`).then(resp => {
    if(resp.error) {
      sms.sendError(phoneNum, 'Sorry, we were unable to understand the address for your event. Please send a new request.');
      res.sendStatus(500);
      return;
    }

    const longitude = resp.data.longt;
    const lattitude = resp.data.latt;

    const sportConfidence = [];
    sports.forEach(sport => {
      sportConfidence.push({
        sport: sport,
        confidence: stringSimilarity.findBestMatch(sport, mes.split(' ')).bestMatch.rating,
      });
    });

    const mostLikelySport = sportConfidence.reduce((bestSoFar, sportObj) =>
      bestSoFar === null || sportObj.confidence > bestSoFar.confidence ? sportObj : bestSoFar
    , null);
    if(mostLikelySport.confidence < 0.70) {
      sms.sendError(phoneNum, 'Sorry, we were unable to understand the sport that you want to play. Please send a new request.')
      res.sendStatus(500);
      return;
    }

    gameController.addGameTextMode({ sport: mostLikelySport.sport, time: date, smsNum: phoneNum }, { lat: +lattitude, lng: +longitude }, phoneNum, res);

    sms.sendError(phoneNum, 'Congratulations, you have been added to the game queue. We will let you know when your game is ready!');
  }); 
});

export default app;
