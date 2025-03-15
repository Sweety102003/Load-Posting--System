import connectdb from "@/lib/mongodb";
import  Bid from "@/models/Bid";
import Load from "@/models/Load"
import User from "@/models/User"
import jwt, { decode } from "jsonwebtoken";
import { NextResponse } from "next/server";
const Jwt_secret=process.env.Jwt_secret;
export async function GET(req){
await connectdb();
try{

    const authHeader=await req.headers.get("authorization");
    if(!authHeader){
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
const token= authHeader.split(" ")[1];
console.log(token);

const decoded=jwt.verify(token,Jwt_secret);
const user=await User.findOne({_id:decoded._id});
console.log(user);
if(user.role !== "shipper"){
    return NextResponse.json({ message: "Only shippers can view bids" });
}
const loads = await Load.find({ shipperid: decoded._id }).select("_id");
    const loadIds = loads.map((load) => load._id);
console.log(loadIds);
    const bids =await Bid.find({loadid: { $in : loadIds}}).populate("truckersid","name , email");

    return NextResponse.json({ bids }, { status: 200 });
}catch(error){
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
}




}