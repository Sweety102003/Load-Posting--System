import mongoose from "mongoose";
import Load from "../models/Load";
import User from "../models/User"
const bidschema= new mongoose.Schema({
loadid:{
    type : mongoose.Schema.Types.ObjectId,
    ref:"Load",
    req:true,
},
truckersid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    req:true,
    
},
bidamount:{
    type:String,
    req:true
},

status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
}, { timestamps: true }
);
 const Bid =mongoose.models.Bid || mongoose.model("Bid", bidschema);
 export default Bid;


