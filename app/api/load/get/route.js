import connectDB from "@/lib/mongodb";
import Load from "@/models/Load";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const Jwt_secret = process.env.Jwt_secret;

export async function GET(req) {
  await connectDB();
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, Jwt_secret);

    const user = await User.findById(decoded._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let query = {};
    
    if (user.role === "shipper") {
      query.shipperid = decoded._id;
    }

    const url = new URL(req.url);
    const pickuplocation = url.searchParams.get("pickuplocation");
    const dropofflocation = url.searchParams.get("dropofflocation");
    const maxTime = url.searchParams.get("maxTime");

    if (pickuplocation) query.pickuplocation = new RegExp(pickuplocation, "i");
    if (dropofflocation) query.dropofflocation = new RegExp(dropofflocation, "i");
    if (maxTime) query.timeLimit = { $lte: Number(maxTime) };

    const loads = await Load.find(query);

    return NextResponse.json({ loads }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
