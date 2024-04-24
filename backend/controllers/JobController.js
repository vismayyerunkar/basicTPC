import JobModel from "../models/Jobs.js";
import UserModel from '../models/User.js';


export const getAllJobs = async (req, res) => {
    try {
      const jobs = await JobModel.find().populate("intrests").populate("applications");
      console.log(jobs[0])
      for(var i = 0;i<jobs.length;i++){
        if(jobs[i].intrests.find(x => x.email == req.email)){
          jobs[i] = {...jobs[i]._doc,isIntrested:true,intrestCount:jobs[i].intrests?.length}
        }else{
          jobs[i] = {...jobs[i]._doc,isIntrested:false,intrestCount:jobs[i].intrests?.length}
        }
        console.log(jobs[i])
        if(jobs[i].applications.find(x => x.email == req.email)){
          jobs[i] = {...jobs[i],hasApplied:true,applicationsCount:jobs[i].applications?.length}
        }else{
          jobs[i] = {...jobs[i],hasApplied:false,applicationsCount:jobs[i].applications?.length}
        }
      }
      
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
export const createJob = async (req, res) => {
    try {
    if(!req.isAdmin){
        return res.status(400).json({ message: 'Permission denied' });
    }
      const { companyName, description,examDate,resultLink,testLink } = req.body;
  
      const newJob = new JobModel({ companyName, description,examDate,resultLink,testLink});
      await newJob.save();
      res.status(201).json({...newJob,success:true});
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};


export const addIntrest = async (req, res) => {
    try {
      const { jobId } = req.body;
  
      const job = await JobModel.findOne({_id:jobId}).populate("intrests").populate("applications");

      if(!job){
        res.status(400).json({ message: 'Job not found' });
      }

      if(job.intrests.find(j => j.email == req.email)){
        job.intrests = job.intrests.filter(x => x.email != req.email);
      }else{
        job.intrests.push(req.userId);
      }

      await job.save();
      return res.status(200).json({success:true})

    } catch (error) {
      console.error('Error adding job intrest:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const apply = async (req, res) => {
    try {
      const { jobId } = req.body;
      if(!req.email){
        res.status(400).json({ message: 'Email not found in request' });
      }
  
      const job = await JobModel.findOne({_id:jobId}).populate("intrests").populate("applications");
      const user = await UserModel.findOne({email:req.email});

      if(!job){
        res.status(400).json({ message: 'Job not found' });
      }

      if(job.applications.find(x => x.email == req.email)){
        res.status(400).json({ message: 'Already applied for this job' });
      }
      job.applications.push(user._id);
      await job.save();
      return res.status(200).json({success:true})
    } catch (error) {
      console.error('Error adding job intrest:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};


export const getApplications = async (req, res) => {
    try {
      if(!req.isAdmin){
        return res.status(400).json({ message: 'Permission denied' });
      }
      const { jobId } = req.params;
  
      const job = await JobModel.findById(jobId).populate('applications');
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      res.json(job);
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  export const addTestLink = async (req, res) => {
    try {
      if(!req.isAdmin){
        return res.status(400).json({ message: 'Permission denied' });
      }
      const { jobId,testLink } = req.params;
  
      const job = await JobModel.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' ,success:false});
      }

      job.testLink = testLink;
      await job.save();
  
      return res.status(200).json({ message: 'Added test link' ,success:true});
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ message: 'Internal server error',success:false });
    }
  }


  export const addResultLink = async (req, res) => {
    try {
      if(!req.isAdmin){
        return res.status(400).json({ message: 'Permission denied' });
      }
      const { jobId,resultLink } = req.params;
  
      const job = await JobModel.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' ,success:false});
      }

      job.resultLink = resultLink;
      await job.save();
  
      return res.status(200).json({ message: 'Added result link' ,success:true});
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ message: 'Internal server error',success:false });
    }
  }

  export const changeJobExamStatus = async (req, res) => {
    try {
      if(!req.isAdmin){
        return res.status(400).json({ message: 'Permission denied' });
      }
      const { jobId,status } = req.body;
  
      const job = await JobModel.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' ,success:false});
      }

      job.examStatus = status;
      await job.save();
  
      return res.status(200).json({ message: 'Added result link' ,success:true});
    } catch (error) {
      console.error('Error fetching job:', error);
      res.status(500).json({ message: 'Internal server error',success:false });
    }
  }
