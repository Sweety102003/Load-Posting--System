import connectdb from "../../../../lib/mongodb";
import User from "../../../../models/User"
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const Jwt_secret=process.env.Jwt_secret;
 export async function POST(req){
await connectdb();
try{
const {email , password}=await req.json();
const user=await User.findOne({email});
if(! user)
{
    return NextResponse.json({message:"User not exist with such email"})
}
 const validuser= await bcrypt.compare(password,user.password);
 if(!validuser){
    return  NextResponse.json({message:"invalid password"}, {status:400})
 };
const token =jwt.sign({_id:user.id
    
},Jwt_secret);
return NextResponse.json({message:"login successfully" , token , user},{status:200});

}
catch(error )
{
    console.log(error);
   return  NextResponse.json({message: error.message},{status:500});
}
 }