import connectdb from "@/lib/mongodb";
import Load from "@/models/Load";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const Jwt_secret = process.env.Jwt_secret;

export async function POST(req) {
  await connectdb();
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, Jwt_secret);

    if (decoded.role !== "trucker") {
      return NextResponse.json({ message: "Only truckers can update load status" }, { status: 403 });
    }

    const { loadid, status } = await req.json();

    const load = await Load.findById(loadid);
    if (!load) {
      return NextResponse.json({ message: "Load not found" }, { status: 404 });
    }

    if (load.assignedTrucker.toString() !== decoded._id) {
      return NextResponse.json({ message: "Unauthorized to update this load" }, { status: 403 });
    }

    load.status = status;
    await load.save();

    return NextResponse.json({ message: "Load status updated successfully", load }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
