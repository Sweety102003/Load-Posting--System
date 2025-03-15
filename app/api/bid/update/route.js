import connectdb from "@/lib/mongodb";
import Bid from "@/models/Bid";
import Load from "@/models/Load";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectdb();
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (user.role !== "shipper") {
      return NextResponse.json({ message: "Only shippers can accept bids" }, { status: 403 });
    }

    const { bidid, loadid, status } = await req.json();

    if (bidid) {
      const bid = await Bid.findById(bidid).populate("truckersid");
      if (!bid) {
        return NextResponse.json({ message: "Bid not found" }, { status: 404 });
      }

      const load = await Load.findById(bid.loadid);
      if (load.shipperid.toString() !== decoded._id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }

      if (status === "accepted") {
        await Bid.updateMany({ loadid: bid.loadid, _id: { $ne: bidid } }, { status: "rejected" });

        load.status = "in-progress";
        load.assignedTrucker = bid.truckersid;
        await load.save();
      }

      bid.status = status;
      await bid.save();

      if (status === "accepted") {
        await sendEmailNotification(bid.truckersid.email, bid.truckersid.name, bid.bidamount);
      }

      return NextResponse.json({ message: `Bid ${status} successfully!` }, { status: 200 });
    }

    if (!bidid && loadid) {
      const lowestBid = await Bid.findOne({ loadid, status: "pending" })
        .sort({ bidamount: 1 }) 
        .populate("truckersid");

      if (!lowestBid) {
        return NextResponse.json({ message: "No valid bids found" }, { status: 404 });
      }

      await Bid.updateMany({ loadid, _id: { $ne: lowestBid._id } }, { status: "rejected" });

      lowestBid.status = "accepted";
      await lowestBid.save();

      const load = await Load.findByIdAndUpdate(loadid, {
        status: "in-progress",
        assignedTrucker: lowestBid.truckersid._id,
      });

      await sendEmailNotification(lowestBid.truckersid.email, lowestBid.truckersid.name, lowestBid.bidamount);

      return NextResponse.json({ message: "Lowest bid accepted!", bid: lowestBid }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

async function sendEmailNotification(email, name, amount) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email_user,
      pass: process.env.Email_pass,
    },
  });

  const mailOptions = {
    from: process.env.Email_user,
    to: email,
    subject: "Bid Accepted - Load Update",
    text: `Hello ${name},\n\nYour bid of $${amount} has been accepted.\nPlease proceed with the delivery.\n\nBest regards,\nTruckLoad Team`,
  };

  await transporter.sendMail(mailOptions);
}
