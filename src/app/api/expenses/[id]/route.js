import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";

import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// UPDATE EXPENSE
export async function PUT(req, context) {

  try {

    await connectDB();

    const session =
      await getServerSession(authOptions);

    // NOT LOGGED IN
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // FIX FOR NEXT.JS 16
    const { id } = await context.params;

    const body = await req.json();

    // FIND USER EXPENSE
    const expense =
      await Expense.findOne({
        _id: id,
        userId: session.user.id,
      });

    // NOT FOUND
    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // UPDATE
    const updatedExpense =
      await Expense.findByIdAndUpdate(
        id,
        body,
        { new: true }
      );

    return NextResponse.json(updatedExpense);

  } catch (err) {

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// DELETE EXPENSE
export async function DELETE(req, context) {

  try {

    await connectDB();

    const session =
      await getServerSession(authOptions);

    // NOT LOGGED IN
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // FIX FOR NEXT.JS 16
    const { id } = await context.params;

    // DELETE ONLY OWN EXPENSE
    const deletedExpense =
      await Expense.findOneAndDelete({
        _id: id,
        userId: session.user.id,
      });

    // NOT FOUND
    if (!deletedExpense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}