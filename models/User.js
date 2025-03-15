import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
name:{
    type:String,
    req:true
},
email:{
    type:String,
    req:true
},
password:{
type:String ,
req:true
},
role:{
    type: String, 
    enum: ["shipper", "trucker"],
     req: true 
},
accidents: { type: String},
theftcomplaints: { type: String },
truckage: { type: String, required: false }, 
licenseheldYears: { type: String, required: false }, 
iseligible: { type: Boolean},
});
const User=mongoose.models.User || mongoose.model("User" , userSchema);
export default User;