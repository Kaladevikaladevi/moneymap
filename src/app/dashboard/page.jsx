"use client";

import { useState } from "react";
import useSWR from "swr";

import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

import { motion } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Dashboard() {
  const { data = [], isLoading, error, mutate } = useSWR(
    "/api/expenses",
    fetcher
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: "", amount: "", category: "" });
    setEditId(null);
  };

  // ADD / UPDATE
  const handleSubmit = async () => {
    if (!form.title || !form.amount) return;

    const url = editId ? `/api/expenses/${editId}` : "/api/expenses";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: new Date().toISOString().split("T")[0],
      }),
    });

    if (!res.ok) {
      alert("Something went wrong!");
      return;
    }

    await mutate();
    setOpen(false);
    resetForm();
  };

  // DELETE
  const deleteExpense = async (id) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Delete failed!");
      return;
    }

    await mutate();
  };

  // EDIT
  const startEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    });

    setEditId(expense._id);
    setOpen(true);
  };

  // FILTER
  const filtered = (data || []).filter((item) => {
    const matchSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "" ? true : item.category === category;

    return matchSearch && matchCategory;
  });

  const total = filtered.reduce(
    (acc, item) => acc + Number(item.amount || 0),
    0
  );

  // CATEGORY DATA
  const categoryData = Object.values(
    filtered.reduce((acc, item) => {
      const key = item.category || "Other";

      if (!acc[key]) acc[key] = { name: key, value: 0 };
      acc[key].value += Number(item.amount || 0);

      return acc;
    }, {})
  );

  // MONTHLY DATA
  const monthlyData = Object.values(
    filtered.reduce((acc, item) => {
      if (!item.date) return acc;

      const month = new Date(item.date).toLocaleString("default", {
        month: "short",
      });

      if (!acc[month]) acc[month] = { month, value: 0 };
      acc[month].value += Number(item.amount || 0);

      return acc;
    }, {})
  );

  if (isLoading)
    return <div className="text-white p-10">Loading...</div>;

  if (error)
    return <div className="text-red-500 p-10">Error loading data</div>;

  return (

    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white px-4 py-6 md:px-12 md:py-10">
      <Navbar />

     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 backdrop-blur-xl">

        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Expense Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Track expenses, analyze spending, and improve your financial habits.
            </p>
          </div>

          <div className="bg-green-500 text-black px-4 py-2 rounded-xl font-semibold w-fit">
            Total: ₹{total}
          </div>
        </div>

        {/* MINI ANALYTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <div className="bg-gray-900/70 border border-gray-800 p-4 rounded-2xl">
            <p className="text-gray-400 text-sm">Transactions</p>
            <h2 className="text-2xl font-bold">{filtered.length}</h2>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-4 rounded-2xl">
            <p className="text-gray-400 text-sm">Average Spend</p>
            <h2 className="text-2xl font-bold text-green-400">
              ₹{filtered.length ? (total / filtered.length).toFixed(0) : 0}
            </h2>
          </div>

          <div className="bg-gray-900/70 border border-gray-800 p-4 rounded-2xl">
            <p className="text-gray-400 text-sm">Highest Expense</p>
            <h2 className="text-lg font-bold text-red-400 truncate">
              {filtered.reduce((max, item) =>
                Number(item.amount) > Number(max.amount || 0) ? item : max,
                {}
              ).title || "N/A"}
            </h2>
          </div>

        </div>

        {/* FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          <input
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-full sm:w-48 p-3 bg-gray-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
          </select>

          <button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-xl text-black font-semibold"
          >
            + Add Expense
          </button>

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* PIE CHART */}
          <div className="bg-gray-900/60 p-4 sm:p-6 rounded-2xl border border-gray-800">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Category Breakdown
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={`hsl(${index * 60},70%,50%)`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="bg-gray-900/60 p-4 sm:p-6 rounded-2xl border border-gray-800">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Monthly Expenses
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* EXPENSE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

          {filtered.map((expense) => (
            <div
              key={expense._id}
              className="bg-gray-900/70 p-4 sm:p-5 rounded-2xl border border-gray-800"
            >
              <h2 className="text-lg font-bold truncate">
                {expense.title}
              </h2>

              <p className="text-green-400 text-xl sm:text-2xl font-bold mt-2">
                ₹{expense.amount}
              </p>

              <p className="text-gray-400 text-sm">
                {expense.category}
              </p>

              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => startEdit(expense)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-xl text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteExpense(expense._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-xl text-sm"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* MODAL */} {open && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"> {/* modal box */} <div className="w-[92%] max-w-md rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl p-6 animate-fadeIn"> {/* header */} <div className="mb-5"> <h2 className="text-2xl font-semibold text-white"> {editId ? "Edit Expense" : "Add Expense"} </h2> <p className="text-sm text-gray-400"> Fill in the details below </p> </div> {/* form */} <div className="space-y-4"> {/* TITLE */} <div> <label className="text-xs text-gray-400">Title</label> <input name="title" placeholder="e.g. Grocery shopping" value={form.title} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl bg-gray-900 border border-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" /> </div> {/* AMOUNT */} <div> <label className="text-xs text-gray-400">Amount</label> <input name="amount" type="number" placeholder="e.g. 500" value={form.amount} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl bg-gray-900 border border-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" /> </div> {/* CATEGORY */} <div> <label className="text-xs text-gray-400">Category</label> <input name="category" placeholder="Food, Travel, Bills..." value={form.category} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl bg-gray-900 border border-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" /> </div> </div> {/* buttons */} <div className="flex gap-3 mt-6"> <button onClick={handleSubmit} className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-xl transition" > {editId ? "Update Expense" : "Add Expense"} </button> <button onClick={() => setOpen(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition" > Cancel </button> </div> </div> </div>)}

      </div>

      {/* <Footer /> */}
    </main>
  );
}