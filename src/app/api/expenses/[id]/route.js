import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { NextResponse } from "next/server";



export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ✅ FIX HERE

    const body = await req.json();

    await Expense.findByIdAndUpdate(id, body);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ✅ FIX HERE

    await Expense.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}