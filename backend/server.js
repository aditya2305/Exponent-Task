import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import getUserData from './jobs/getUserData.js';
import incrementUserScore from './jobs/incrementUserScore.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Database connection successful!');
})
.catch((err) => {
    console.error('Database connection error:', err);
});


app.get('/api/user/:id', getUserData);
app.post('/api/user/:id/click', incrementUserScore);
app.get("/", (req, res)=>{
    res.send("started")
})

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, ()=>{"Server started on port 3001"});
