import connectdb from "@/lib/mongodb";
import Load from "@/models/Load";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const Jwt_secret = process.env.Jwt_secret;

export async function POST(req) {
  await connectdb();
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, Jwt_secret);

    if (decoded.role !== "trucker") {
      return NextResponse.json({ message: "Only truckers can update location" }, { status: 403 });
    }

    const { loadid, latitude, longitude } = await req.json();

    const load = await Load.findById(loadid);
    if (!load) {
      return NextResponse.json({ message: "Load not found" }, { status: 404 });
    }

    load.location = { latitude, longitude };
    await load.save();

    return NextResponse.json({ message: "Location updated successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
