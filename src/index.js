// import mongoose from "mongoose";

import connectDB from "./db/db.js";
import dotenv from 'dotenv'
import { app } from './app.js';


// const app = express()
// app()
dotenv.config()

connectDB().then(()=>app.listen(process.env.PORT || 8000, ()=>{
    console.log(`server is connected at ${process.env.PORT}`);
})).catch((err)=>{
    console.log('mongo db connection failed', err);
})







//this could be one approach to connect db

// (async ()=>{
//     try {
//       const db =  await mongoose.connect(process.env.MONGO_DB)
//       app.on("error",(error)=>{
//         console.log("err", error);
//         throw error
//       })
//       if(db){
//         console.log('database is connected');
//       }
//       app.listen(process.env.PORT, ()=>{

//       })
//     } catch (error) {
//         console.log('error in database', error);
//     }
// })()