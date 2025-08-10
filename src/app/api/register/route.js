// /api/register
import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ message: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 5) {
      return Response.json({ message: "Password must be at least 5 characters long." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email });

    if (user) {
      console.log("User exists — updating password");
      user.password = hashedPassword;
      await user.save();
    } else {
      console.log("Creating new user");
      user = await User.create({ email, password: hashedPassword });
      await user.save();
    }

    return Response.json({ message: "Registration successful" }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return Response.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
