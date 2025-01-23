import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import getUserData from './jobs/getUserData.js';
import incrementUserScore from './jobs/incrementUserScore.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://adityasaxena33:Yz6gM92eWUWbgv5w@cluster0.lhm8x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Database connection successful!');
});

app.get('/api/user/:id', getUserData);
app.post('/api/user/:id/click', incrementUserScore);
app.get("/", (req, res)=>{
    res.send("started")
})

app.listen(3001, '0.0.0.0', ()=>{"Server started on port 3001"});
