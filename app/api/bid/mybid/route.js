import connectdb from "@/lib/mongodb";
import Bid from "@/models/Bid";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const Jwt_secret = process.env.Jwt_secret;

export async function GET(req) {
  await connectdb();
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, Jwt_secret);

    const bids = await Bid.find({ truckersid: decoded._id }).populate("loadid");

    return NextResponse.json({ message: "Bids fetched", bids }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
