import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";

import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET USER EXPENSES
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    // NOT LOGGED IN
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // GET ONLY CURRENT USER EXPENSES
    const expenses = await Expense.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(expenses);

  } catch (error) {

    return NextResponse.json(
      { error: "Fetch failed" },
      { status: 500 }
    );
  }
}

// CREATE EXPENSE
export async function POST(req) {

  try {

    await connectDB();

    const session = await getServerSession(authOptions);

    // NOT LOGGED IN
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // CREATE NEW EXPENSE
    const newExpense = await Expense.create({
      ...body,
      userId: session.user.id,
    });

    return NextResponse.json(newExpense);

  } catch (error) {

    return NextResponse.json(
      { error: "Create failed" },
      { status: 500 }
    );
  }
}