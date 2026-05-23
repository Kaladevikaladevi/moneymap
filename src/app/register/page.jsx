"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Something went wrong"
        );

        setLoading(false);
        return;
      }

      setSuccess(
        "Account created successfully"
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="registerPage">

        <div className="registerCard">

          <h1 className="registerTitle">
            Create Account
          </h1>

          <p className="registerSubtitle">
            Join MoneyMap and start
            tracking your expenses
            smartly and securely.
          </p>

          <form
            onSubmit={handleRegister}
            className="registerForm"
          >

            {/* NAME */}
            <div className="inputGroup">

              <label className="inputLabel">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="registerInput"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>

            {/* EMAIL */}
            <div className="inputGroup">

              <label className="inputLabel">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="registerInput"
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
                className="registerInput"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
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

            {/* SUCCESS */}
            {success && (
              <div className="successMessage">
                {success}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="registerBtn"
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="registerFooter">
            Already have an account?{" "}

            <span
              onClick={() =>
                router.push("/login")
              }
            >
              Login
            </span>
          </div>

        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .registerPage {
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

        .registerCard {
          width: 100%;
          max-width: 460px;

          background: rgba(
            17,
            24,
            39,
            0.92
          );

          border: 1px solid #1f2937;

          border-radius: 24px;

          padding: 40px 30px;

          backdrop-filter: blur(10px);

          box-shadow:
            0 10px 25px
              rgba(0, 0, 0, 0.4),
            0 0 20px
              rgba(
                59,
                130,
                246,
                0.1
              );

          transition: 0.3s ease;
        }

        .registerCard:hover {
          transform: translateY(-5px);

          box-shadow:
            0 15px 35px
              rgba(0, 0, 0, 0.5),
            0 0 25px
              rgba(
                59,
                130,
                246,
                0.15
              );
        }

        /* TITLE */

        .registerTitle {
          font-size: 2.5rem;

          font-weight: 800;

          text-align: center;

          color: white;

          margin-bottom: 10px;
        }

        .registerSubtitle {
          text-align: center;

          color: #9ca3af;

          margin-bottom: 35px;

          line-height: 1.7;
        }

        /* FORM */

        .registerForm {
          display: flex;
          flex-direction: column;

          gap: 20px;
        }

        /* INPUT GROUP */

        .inputGroup {
          display: flex;
          flex-direction: column;

          gap: 8px;
        }

        .inputLabel {
          color: #d1d5db;

          font-size: 15px;

          font-weight: 600;
        }

        .registerInput {
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

        .registerInput:focus {
          border-color: #3b82f6;

          box-shadow:
            0 0 0 4px
              rgba(
                59,
                130,
                246,
                0.2
              );
        }

        /* BUTTON */

        .registerBtn {
          margin-top: 10px;

          padding: 14px;

          border: none;

          border-radius: 14px;

          background: #2563eb;

          color: white;

          font-size: 17px;

          font-weight: 700;

          cursor: pointer;

          transition: 0.3s ease;
        }

        .registerBtn:hover {
          background: #1d4ed8;

          transform: scale(1.02);
        }

        .registerBtn:disabled {
          opacity: 0.7;

          cursor: not-allowed;
        }

        /* ERROR */

        .errorMessage {
          background: rgba(
            239,
            68,
            68,
            0.1
          );

          border: 1px solid
            rgba(
              239,
              68,
              68,
              0.3
            );

          color: #f87171;

          padding: 12px;

          border-radius: 10px;

          text-align: center;

          font-size: 14px;
        }

        /* SUCCESS */

        .successMessage {
          background: rgba(
            34,
            197,
            94,
            0.1
          );

          border: 1px solid
            rgba(
              34,
              197,
              94,
              0.3
            );

          color: #4ade80;

          padding: 12px;

          border-radius: 10px;

          text-align: center;

          font-size: 14px;
        }

        /* FOOTER */

        .registerFooter {
          margin-top: 25px;

          text-align: center;

          color: #9ca3af;

          font-size: 15px;
        }

        .registerFooter span {
          color: #3b82f6;

          cursor: pointer;

          font-weight: 600;

          transition: 0.3s ease;
        }

        .registerFooter span:hover {
          color: #60a5fa;

          text-decoration: underline;
        }

        /* RESPONSIVE */

        @media (max-width: 768px) {

          .registerCard {
            padding: 30px 22px;
          }

          .registerTitle {
            font-size: 2rem;
          }

          .registerSubtitle {
            font-size: 15px;
          }

          .registerInput {
            padding: 13px 14px;
          }

          .registerBtn {
            padding: 13px;

            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}