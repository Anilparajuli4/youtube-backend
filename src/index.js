// import mongoose from "mongoose";
import express from 'express'
import connectDB from "./db/db.js";
import dotenv from 'dotenv'


const app = express()
dotenv.config()

connectDB()







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