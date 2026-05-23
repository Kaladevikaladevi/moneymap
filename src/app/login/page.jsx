"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="loginPage">
        <div className="loginCard">

          <h1 className="loginTitle">
            Welcome Back
          </h1>

          <p className="loginSubtitle">
            Login to your MoneyMap account
            and manage your finances easily.
          </p>

          <form
            onSubmit={handleLogin}
            className="loginForm"
          >

            {/* EMAIL */}
            <div className="inputGroup">

              <label className="inputLabel">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="loginInput"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="inputGroup">

              <label className="inputLabel">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="loginInput"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="errorMessage">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="loginBtn"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="loginFooter">
            Don't have an account?{" "}
            <a href="/register">
              Register
            </a>
          </div>

        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .loginPage {
          min-height: 100vh;

          background: linear-gradient(
            to bottom right,
            #000000,
            #111827,
            #000000
          );

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 40px 20px;
        }

        /* CARD */

        .loginCard {
          width: 100%;
          max-width: 450px;

          background: rgba(17, 24, 39, 0.9);

          border: 1px solid #1f2937;

          border-radius: 24px;

          padding: 40px 30px;

          box-shadow:
            0 10px 25px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(34, 197, 94, 0.1);

          backdrop-filter: blur(10px);

          transition: 0.3s ease;
        }

        .loginCard:hover {
          transform: translateY(-5px);

          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.5),
            0 0 25px rgba(34, 197, 94, 0.15);
        }

        /* TITLE */

        .loginTitle {
          font-size: 2.5rem;
          font-weight: 800;

          text-align: center;

          margin-bottom: 10px;

          color: white;
        }

        .loginSubtitle {
          text-align: center;

          color: #9ca3af;

          margin-bottom: 35px;

          line-height: 1.6;
        }

        /* FORM */

        .loginForm {
          display: flex;
          flex-direction: column;

          gap: 20px;
        }

        /* INPUT */

        .inputGroup {
          display: flex;
          flex-direction: column;

          gap: 8px;
        }

        .inputLabel {
          font-size: 15px;
          font-weight: 600;

          color: #d1d5db;
        }

        .loginInput {
          width: 100%;

          padding: 14px 16px;

          border-radius: 12px;

          border: 1px solid #374151;

          background: #111827;

          color: white;

          font-size: 16px;

          outline: none;

          transition: 0.3s ease;
        }

        .loginInput:focus {
          border-color: #22c55e;

          box-shadow:
            0 0 0 4px rgba(
              34,
              197,
              94,
              0.2
            );
        }

        /* BUTTON */

        .loginBtn {
          margin-top: 10px;

          padding: 14px;

          border: none;

          border-radius: 14px;

          background: #22c55e;

          color: white;

          font-size: 17px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.3s ease;
        }

        .loginBtn:hover {
          background: #16a34a;

          transform: scale(1.02);
        }

        .loginBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* FOOTER */

        .loginFooter {
          margin-top: 25px;

          text-align: center;

          color: #9ca3af;

          font-size: 15px;
        }

        .loginFooter a {
          color: #22c55e;

          text-decoration: none;

          font-weight: 600;

          transition: 0.3s ease;
        }

        .loginFooter a:hover {
          color: #4ade80;
        }

        /* ERROR */

        .errorMessage {
          background: rgba(
            239,
            68,
            68,
            0.1
          );

          border: 1px solid rgba(
            239,
            68,
            68,
            0.3
          );

          color: #f87171;

          padding: 12px;

          border-radius: 10px;

          font-size: 14px;

          text-align: center;
        }

        /* RESPONSIVE */

        @media (max-width: 768px) {

          .loginCard {
            padding: 30px 22px;
          }

          .loginTitle {
            font-size: 2rem;
          }

          .loginSubtitle {
            font-size: 15px;
          }

          .loginInput {
            padding: 13px 14px;
          }

          .loginBtn {
            padding: 13px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}