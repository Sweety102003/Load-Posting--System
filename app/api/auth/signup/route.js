import connectdb from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectdb();
  try {
    const { name, email, password, role, accidents, theftcomplaints, truckage, licenseheldYears } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
console.log(role);
    if (role === "trucker") {
      if (accidents > 0 || theftcomplaints > 0 || truckage > 5 || licenseheldYears < 5) {
        return NextResponse.json(
          { message: "You do not meet the trucker eligibility criteria." },
          
        );
      }

     const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        accidents,
        theftcomplaints,
        truckage,
        licenseheldYears,
      });
    

    } else {
     const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });}
      console.log(newUser);
    

    await newUser.save(); 
    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
