import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'samplesec12';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';


const hashPassword = async (password) => {
    const saltRounds = 5; // Number of salt rounds for bcrypt
    return await bcrypt.hash(password, saltRounds);
};

export const register =  async (req, res) => {
  try {
    console.log(req.body)
    let { email, fullName, password } = req.body;
    password = password.trim();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    let isAdmin = false;
    let hashed = await hashPassword(password)
    const newUser = new UserModel({ email, userName:fullName, password:hashed, isAdmin });
    await newUser.save();

    const token = jwt.sign({ email: newUser.email, isAdmin: newUser.isAdmin,id:newUser._id }, JWT_SECRET);
  
    res.json({ message: 'registration successful', token,status:201 ,username:newUser.userName,isAdmin: newUser.isAdmin});  
} catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
    try {
      let { email, password } = req.body;
      console.log(req.body)
      password = password.trim();
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(200).json({ message: 'User not found' });
      }
      const isCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isCorrect) {
        return res.status(200).json({ message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin,id:user._id }, JWT_SECRET);
  
      res.json({success:true, message: 'Login successful', token ,status:200,username:user.userName,isAdmin: user.isAdmin});
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const generateExpiryTime = () => {
    const now = new Date();
    return new Date(now.getTime() + 5 * 60000);
};
  
  
export const forgotPassword = async (req, res) => {
try {
    
    const {email} = req.body;

    const user = await UserModel.findOne({email:email})

    if (!user) {
        return res.status(200).json({ message: 'check if account exists with this email' ,success:false});
    }
    
    const otp = generateOTP();
    // save the otp for that user
    user.otp= otp;
    user.otpExpiry = generateExpiryTime();
    await user.save();

    const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host:"smtp.gmail.com",
    port:587,
    auth: {
        user: 'memoriesengg2023@gmail.com',
        pass: 'gyrpxujzcfpifpfb', 
    },
    });

    const mailOptions = {
    from: 'memoriesengg2023@gmail.com', 
    to: email, 
    subject: 'Your OTP for verification', 
    text: `Your OTP is: ${otp}`, 
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully',success:true });
} catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP ' });
}
};


export const verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(200).json({ message: 'User not found' ,success:false});
      }
  
      if (!user.otp || user.otpExpiry < new Date()) {
        return res.status(400).json({ message: 'OTP not set or expired' ,success:false});
      }
  
      if (user.otp === otp) {
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: 'OTP verified successfully',success:true });
      } else {
        return res.status(401).json({ message: 'Incorrect OTP' ,success:false});
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Internal server error' ,success:false});
    }
  };
  
  export const changePassword = async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;
  
      const user = await UserModel.findOne({ email });
    
      if (!user) {
        return res.status(200).json({ message: 'User not found' });
      }
      if(await bcrypt.compare(
        oldPassword,
        user.password
      )){
        return res.status(200).json({ message: 'Old password is incorrect',success:false });
      }
  
      user.password = await hashPassword(newPassword);
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully',success:true });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error',success:false });
    }
  };

  export const setPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await UserModel.findOne({ email });
    
      if (!user) {
        return res.status(200).json({ message: 'User not found',success:false });
      }
      
  
      user.password = await hashPassword(password);
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully',success:true });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error',success:false });
    }
};