import mongoose from "mongoose";


 const connectDB =async() =>{
    try {
       const db = await mongoose.connect(process.env.MONGO_DB)
       if(db){
        console.log(`database is connected:`);
       }
    } catch (error) {
        console.log('database connection error', error);
        process.exit(1)
    }
}

//console connectionInstance assignment
// ${connectionInstance.connection.host}

export default connectDB