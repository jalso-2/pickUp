require('dotenv').config();

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

console.log('MONGO_URI: ', process.env.MONGO_URI);
console.log('PORT: ', process.env.PORT);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('And we\'re in!!!');
});

export default db;
