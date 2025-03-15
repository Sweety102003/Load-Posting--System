import connectDB from "@/lib/mongodb";
import Bid from "@/models/Bid";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";

const Jwt_secret = process.env.Jwt_secret;

export async function POST(req) {
  await connectDB();
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, Jwt_secret);
    const user=await User.findOne({_id:decoded._id});
    console.log(user.role);
    if (user.role !== "trucker") {
      return NextResponse.json({ message: "Only truckers can place bids" });
    }
    if (!user.iseligible) {
        return NextResponse.json({ message: "You do not meet eligibility criteria" });
      }
    const { loadid, bidamount } = await req.json();

    const newBid = new Bid({
      loadid,
      truckersid: decoded._id,
      bidamount,
    });

    await newBid.save();
    return NextResponse.json({ message: "Bid placed successfully", bid: newBid }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
