require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const connectDB = require('./src/config/db');
const userRouter=require('./src/routes/userRoutes');
const chatRoutes=require('./src/routes/chatRoutes');
const eventRoutes=require('./src/routes/eventRoutes');

const cookieParser = require("cookie-parser");
const app=express();
const { requireAuth } = require('./src/middleware/auth');
connectDB();

app.use(
    cors({
        origin: "http://localhost:5173", // Change this to your frontend URL
        credentials: true, // ✅ Allows cookies to be sent
    })
);

app.use(express.json());
app.use(morgan('dev'));


app.get('/',(req,res)=>{
    res.send('backend running')
});

app.use('/api/users',userRouter);
app.use('/api',chatRoutes);
app.use('/api/events', eventRoutes);

const PORT=process.env.PORT

app.listen(PORT,()=>{console.log('Server Running');
})
