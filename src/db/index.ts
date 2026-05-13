import mongoose from "mongoose";

async function connectdb(){
   try{
    const mongourl = process.env.MONGODB_URL ?? "";
    const connection = await mongoose.connect(mongourl);
    console.log(`Connection to db ${connection}`)
    return connection;
   }catch(err){
    console.log("connection failed", err);
    throw err;
   }
}

export default connectdb;
