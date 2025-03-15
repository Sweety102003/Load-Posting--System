import mongoose from "mongoose"
const Mongo_url =process.env.Mongo_url;
const connectdb = async()=>{
  await  mongoose.connect(Mongo_url);
  mongoose.connection.on("connected",()=>{
    console.log("successfully cconnected to mongo")
  });
}
export default connectdb;