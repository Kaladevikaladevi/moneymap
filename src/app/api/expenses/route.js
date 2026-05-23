import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Expense from "../../../models/Expense";

// GET ALL EXPENSES
export async function GET() {
  try {
    await connectDB();

    const expenses = await Expense.find();

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// CREATE EXPENSE
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const expense = await Expense.create(body);

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}