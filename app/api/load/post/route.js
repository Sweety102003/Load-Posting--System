import connectDB from "@/lib/mongodb";
import Load from "@/models/Load";
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
console.log(user);

    if (user.role === "trucker") {
      return NextResponse.json({ message: "Only shippers can create loads" });
    }

    const { pickuplocation, dropofflocation, weight, description ,maxTime } = await req.json();
console.log(pickuplocation);
    const newLoad = new Load({
      shipperid: user._id,
      pickuplocation,
      dropofflocation,
      weight,
      description,
      maxTime:maxTime|| null,
    });
console.log(newLoad);
    await newLoad.save();
    return NextResponse.json({ message: "Load posted successfully", load: newLoad }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
