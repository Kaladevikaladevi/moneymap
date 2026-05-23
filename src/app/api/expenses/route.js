import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { NextResponse } from "next/server";

// GET ALL EXPENSES
export async function GET() {
  try {
    await connectDB();
    const expenses = await Expense.find().sort({ createdAt: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

// CREATE EXPENSE
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const newExpense = await Expense.create(body);

    return NextResponse.json(newExpense);
  } catch (error) {
    return NextResponse.json(
      { error: "Create failed" },
      { status: 500 }
    );
  }
}