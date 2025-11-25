import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    console.log("Signup API hit"); // Debug

    await connectDB();

    const { armyId, militaryEmail, password } = await req.json();

    if (!armyId || !militaryEmail || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await User.findOne({ militaryEmail });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      armyId,
      militaryEmail,
      password: hashedPass,
    });

    return NextResponse.json(
      { message: "Signup successful", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("SIGNUP ERROR:", error); // Shows error in terminal
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
