"use client";

import { useState } from "react";
import useSWR from "swr";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


const fetcher = (...args) =>
  fetch(...args).then((res) =>
    res.json()
  );

export default function Dashboard() {

  // FETCH DATA
  const {
    data = [],
    isLoading,
    error,
  } = useSWR(
    "/api/expenses",
    fetcher
  );

  // STATES
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  // LOADING UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl animate-pulse">
          Loading Expenses...
        </h1>
      </div>
    );
  }

  // ERROR UI
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-red-500 text-2xl">
          Failed to load expenses
        </h1>
      </div>
    );
  }

  // SEARCH + FILTER
  const filteredExpenses =
    (data || []).filter((item) => {

      const matchesSearch =
        item.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === ""
          ? true
          : item.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // TOTAL EXPENSE
  const totalExpense =
    filteredExpenses.reduce(
      (acc, item) =>
        acc + Number(item.amount),
      0
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-5 md:p-10">
      
      <Navbar />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-10">

        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Expense Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Manage and track your
            daily expenses easily.
          </p>
        </div>

        {/* TOTAL CARD */}
        <div className="bg-green-500 text-black px-8 py-5 rounded-2xl shadow-xl">

          <h2 className="text-lg font-semibold">
            Total Expenses
          </h2>

          <p className="text-3xl font-bold mt-2">
            ₹{totalExpense}
          </p>

        </div>

      </div>

      {/* FILTER SECTION */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-10 shadow-lg">

        <div className="flex flex-col md:flex-row gap-4">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search expense..."
            className="flex-1 bg-black border border-gray-700 p-3 rounded-xl outline-none focus:border-green-500"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {/* FILTER */}
          <select
            className="bg-black border border-gray-700 p-3 rounded-xl outline-none focus:border-green-500"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">
              All Categories
            </option>

            <option value="Travel">
              Travel
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Shopping">
              Shopping
            </option>

            <option value="Bills">
              Bills
            </option>

            <option value="Entertainment">
              Entertainment
            </option>

          </select>

          {/* ADD BUTTON */}
          <button className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-xl font-bold text-black">
            + Add Expense
          </button>

        </div>

      </div>

      {/* EXPENSE GRID */}
      {filteredExpenses.length === 0 ? (

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">

          <h1 className="text-2xl font-bold mb-3">
            No Expenses Found
          </h1>

          <p className="text-gray-400">
            Try adding new expenses or
            changing filters.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredExpenses.map(
            (expense) => (

              <div
                key={expense._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition duration-300"
              >

                {/* TITLE */}
                <div className="flex items-center justify-between mb-4">

                  <h1 className="text-2xl font-bold">
                    {expense.title}
                  </h1>

                  <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {expense.category}
                  </span>

                </div>

                {/* AMOUNT */}
                <p className="text-4xl font-extrabold text-green-400 mb-4">

                  ₹{expense.amount}

                </p>

                {/* DATE */}
                <p className="text-gray-400 mb-6">

                  {expense.date}

                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">

                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 transition py-2 rounded-xl font-semibold">

                    Edit

                  </button>

                  <button className="flex-1 bg-red-500 hover:bg-red-600 transition py-2 rounded-xl font-semibold">

                    Delete

                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}

      <Footer />
    </main>

  );
}