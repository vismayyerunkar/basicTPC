import express from 'express';
import mongoose from 'mongoose';
import userRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import cors from "cors"

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());
const PORT = process.env.PORT || 5000;

const MONGODB_URI = 'mongodb+srv://karan6234:karan6234@cluster0.p6ype7c.mongodb.net/TPC';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use("/user",userRoutes);
app.use("/admin",jobRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
