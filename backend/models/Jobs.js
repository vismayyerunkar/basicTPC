import mongoose from 'mongoose';

const { Schema } = mongoose;


export const examStatus = Object.freeze({
    PENDING: 'PENDING',
    INPROGRESS: 'INPROGRESS',
    COMPLETED: 'COMPLETED',
});

const JobSchema = new Schema({
  companyName: String,
  description:String,
  resultLink:{
    type:String,
    required:false,
    default:""
  },
  testLink:{
    type:String,
    required:false,
    default:""
  },
  examDate: String,
  examStatus: {
    type: String,
    enum: Object.values(examStatus),
    default:examStatus.PENDING
  },
  applications:[{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
  intrests:[{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
});

 const JobModel = mongoose.model('JobModel', JobSchema);
 export default JobModel