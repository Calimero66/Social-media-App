import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import cors from 'cors';
import Routes from './routes/Routes.js';
import cookieParser from 'cookie-parser';



const app = express();
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/sma', Routes);

const PORT = process.env.PORT;

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
}

main();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});