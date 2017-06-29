require('dotenv').config();

import mongoose from 'mongoose';

const options = {
  auth: {
    authSource: 'admin',
  },
};

mongoose.connect(process.env.MONGO_URI, options, (err) => console.log(err));
const db = mongoose.connection;

console.log('MONGO_URI: ', process.env.MONGO_URI);
console.log('PORT: ', process.env.PORT);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('And we\'re in!!!');
});

export default db;
