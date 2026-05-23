import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function PUT(req, { params }) {
  const data = await req.json();

  await connectDB();

  const updatedExpense =
    await Expense.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );

  return NextResponse.json(updatedExpense);
}

export async function DELETE(req, { params }) {
  await connectDB();

  await Expense.findByIdAndDelete(params.id);

  return NextResponse.json({
    message: "Deleted",
  });
}