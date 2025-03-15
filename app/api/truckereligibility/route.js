import connectdb from "@/lib/mongodb";
import User from "@/models/User";
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

    const user = await User.findById(decoded._id);
    if (!user || user.role !== "trucker") {
      return NextResponse.json({ message: "Invalid user" }, { status: 403 });
    }

    const isEligible =
      user.accidents === 0 &&
      user.theftcomplaints === 0 &&
      user.truckage <= 5 &&
      user.licenseheldYears >= 5;

    user.iseligible = isEligible;
    await user.save();

    return NextResponse.json({ message: "Eligibility checked", isEligible , user}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
