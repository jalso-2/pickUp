import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
  smsNum: 'string',
   address: 'mixed',
});

export default userSchema;