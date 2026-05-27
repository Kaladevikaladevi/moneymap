"use client";

import Link from "next/link";
import { useState } from "react";

import { signOut, useSession } from "next-auth/react";

export default function Navbar() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const { data: session } = useSession();

  return (
    <nav className="w-full bg-black text-white border-b border-gray-800 fixed top-0 left-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-green-400"
        >
          MoneyMap
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            href="/"
            className="hover:text-green-400 transition"
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className="hover:text-green-400 transition"
          >
            Dashboard
          </Link>

          {!session ? (
            <>
              <Link
                href="/login"
                className="hover:text-green-400 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-xl font-semibold"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-xl font-semibold"
            >
              Logout
            </button>
          )}

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >

          <div className="space-y-1">

            <span className="block w-6 h-0.5 bg-white"></span>

            <span className="block w-6 h-0.5 bg-white"></span>

            <span className="block w-6 h-0.5 bg-white"></span>

          </div>

        </button>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (

        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-5 flex flex-col gap-5">

          <Link
            href="/"
            onClick={() =>
              setMenuOpen(false)
            }
            className="hover:text-green-400 transition"
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            onClick={() =>
              setMenuOpen(false)
            }
            className="hover:text-green-400 transition"
          >
            Dashboard
          </Link>

          {!session ? (
            <>
              <Link
                href="/login"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="hover:text-green-400 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded-xl font-semibold text-center"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-xl font-semibold"
            >
              Logout
            </button>
          )}

        </div>

      )}

    </nav>
  );
}