// src/app/api/auth/register/route.js
import dbConnect from "@/lib/mongodb/connect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { username, password, role } = await request.json();

    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username already exists" },
        { status: 409 } // Conflict
      );
    }

    // Create new user
    const user = await User.create({ 
      username, 
      password, 
      role: role || 'teacher' // Default to 'teacher' if role is not provided
    });

    // Don't send password back, even though it's hashed
    user.password = undefined;

    return NextResponse.json({ success: true, user }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    // Handle potential Mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

