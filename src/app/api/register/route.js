import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";

import User from "@/models/User";

export async function POST(req) {

  try {

    // GET DATA
    const body = await req.json();

    const name = body.name?.trim();

    const email = body.email?.trim().toLowerCase();

    const password = body.password?.trim();

    // VALIDATION
    if (
      !name ||
      !email ||
      !password
    ) {

      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // CONNECT DATABASE
    await connectDB();

    // CHECK EXISTING USER
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return NextResponse.json(
        {
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // SUCCESS
    return NextResponse.json(
      {
        message:
          "User registered successfully",
      },
      { status: 201 }
    );

  } catch (error) {

    console.log(
      "REGISTER ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Server error",
      },
      { status: 500 }
    );
  }
}