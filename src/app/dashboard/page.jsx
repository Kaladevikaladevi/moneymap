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

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    // CANCEL
    if (!confirmDelete) {
      return;
    }

    try {

      await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      mutate();

      alert("Expense deleted successfully");

    } catch (error) {

      alert("Delete failed");

    } 
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
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Salary">Salary</option>
            <option value="Investment">Investment</option>
            <option value="Groceries">Groceries</option>
            <option value="Transport">Transport</option>
            <option value="Rent">Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Insurance">Insurance</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Gifts">Gifts</option>
            <option value="Savings">Savings</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Mobile Recharge">Mobile Recharge</option>
            <option value="Internet">Internet</option>
            <option value="Other">Other</option>
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">

          {/* PIE CHART */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900/90 to-gray-950 shadow-2xl backdrop-blur-xl p-5 sm:p-7"
          >

            {/* glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Category Breakdown
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Spending by category
                  </p>
                </div>

                <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs border border-green-500/20">
                  Analytics
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={4}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={`hsl(${index * 45}, 80%, 55%)`}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>

            </div>
          </motion.div>

          {/* BAR CHART */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900/90 to-gray-950 shadow-2xl backdrop-blur-xl p-5 sm:p-7"
          >

            {/* glow */}
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Monthly Expenses
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Monthly spending overview
                  </p>
                </div>

                <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs border border-blue-500/20">
                  Reports
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={monthlyData}
                  barSize={40}
                >
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="value"
                    radius={[14, 14, 0, 0]}
                    fill="#22c55e"
                  />
                </BarChart>
              </ResponsiveContainer>

            </div>
          </motion.div>

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
                  onClick={() => handleDelete(expense._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-xl text-sm"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* MODAL */}
        {open && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* modal box */}
          <div className="w-[92%] max-w-md rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl p-6 animate-fadeIn">
            {/* header */}
            <div className="mb-5"> <h2 className="text-2xl font-semibold text-white">
              {editId ? "Edit Expense" : "Add Expense"}
            </h2>
              <p className="text-sm text-gray-400"> Fill in the details below </p>
            </div>
            {/* form */}
            <div className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="text-xs text-gray-400">Title</label>
                <input name="title" placeholder="e.g. Grocery shopping" value={form.title} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl bg-gray-900 border border-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
              </div>
              {/* AMOUNT */}
              <div>
                <label className="text-xs text-gray-400">Amount</label>
                <input name="amount" type="number" placeholder="e.g. 500" value={form.amount} onChange={handleChange} className="w-full mt-1 p-3 rounded-xl bg-gray-900 border border-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
              </div>
              {/* CATEGORY */}
              <div>
                <label className="text-xs text-gray-400">Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 rounded-xl bg-gray-900 border border-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                >
                  <option value="">Select Category</option>

                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Salary">Salary</option>
                  <option value="Investment">Investment</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Transport">Transport</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Savings">Savings</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Mobile Recharge">Mobile Recharge</option>
                  <option value="Internet">Internet</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {/* buttons */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleSubmit} className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-xl transition" >
                {editId ? "Update Expense" : "Add Expense"}
              </button>
              <button onClick={() => setOpen(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition" >
                Cancel
              </button>
            </div>
          </div>
        </div>)}

      </div>

      {/* <Footer /> */}
    </main>
  );
}