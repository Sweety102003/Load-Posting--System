import connectdb from "@/lib/mongodb";
import Load from "@/models/Load";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const Jwt_secret = process.env.Jwt_secret;

export async function GET(req) {
  await connectdb();
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, Jwt_secret);

    if (decoded.role !== "shipper") {
      return NextResponse.json({ message: "Only shippers can view tracking" }, { status: 403 });
    }

    const loads = await Load.find({ shipperid: decoded._id }).select("location status assignedTrucker");

    return NextResponse.json({ loads }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
