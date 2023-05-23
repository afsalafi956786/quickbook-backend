import  express  from 'express';
import logger from 'morgan'
import connectDb from './config/dbconnection.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config();
import userRouter from './routes/users.js';
import adminRouter from './routes/admin.js'
import venderRouter from './routes/vendor.js';
import chatRouter from './routes/chat.js';
import messageRoter from './routes/message.js'


const port=process.env.PORT
const DATABASE_URL=process.env.DATABASE_URL
console.log(DATABASE_URL)
const app=express();
connectDb(DATABASE_URL)

//cors connect
app.use(cors(
//     {
//     origin: ['http://localhost:3000'],
//     methods:["GET","POST","DELETE","PUT","PATCH"],
//     credentials:true,
// }
))
app.use(logger("dev"))
app.use(express.urlencoded({ extended:false }));
app.use(express.json({extended: false, limit: '50mb'}));
app.use(express.static("public"))


//routes
app.use('/api/',userRouter);
app.use('/api/vendor',venderRouter);
app.use('/api/admin',adminRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message',messageRoter)

// app.use('/admin',adminRouter);


app.listen(port)


export default app