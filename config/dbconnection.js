import mongoose  from "mongoose";

const connectDb=async (DATABASE_URL)=>{
    mongoose.set('strictQuery',false);
    try{
        const DB_OPTION={dbName:'quickbook'}
        await mongoose.connect(DATABASE_URL,DB_OPTION)
        console.log(DATABASE_URL);
        console.log('connected successfully..');
    }catch(error){
        console.log(error);
    }
}
export default connectDb;  