import mongoose from "mongoose";
const loadschema=new mongoose.Schema({
shipperid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
pickuplocation:{
    type:String,
req:true
},
dropofflocation:{
    type:String ,
    req:true
},
weight:{
    type:Number,
    req:true,
},
description:{
    type:String,
    req:true
},
maxTime:{
    type:Number,
},

status: {
    type: String,
  },
  assignedTrucker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
}, { timestamps: true }
);
const Load = mongoose.models.Load || mongoose.model("Load", loadschema);

export default Load;