import mongoose from 'mongoose';

const { Schema } = mongoose;


const UserSchema = new Schema({
  email: String,
  userName:String,
  password: String,
  isAdmin:Boolean,
  otp: String, 
  otpExpiry: Date, 
});
const userModel =  mongoose.model('UserModel', UserSchema);

export default userModel;