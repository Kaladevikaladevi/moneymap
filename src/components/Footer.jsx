export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-white">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* LOGO + ABOUT */}
          <div>

            <h1 className="text-3xl font-bold text-green-400 mb-4">
              MoneyMap
            </h1>

            <p className="text-gray-400 leading-7">
              Smart expense management platform
              built with Next.js to help users
              track spending, manage budgets,
              and improve financial habits.
            </p>

          </div>

          {/* QUICK LINKS */}
          <div>

            <h2 className="text-xl font-semibold mb-4">
              Quick Links
            </h2>

            <ul className="space-y-3 text-gray-400">

              <li>
                <a
                  href="/"
                  className="hover:text-green-400 transition"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/dashboard"
                  className="hover:text-green-400 transition"
                >
                  Dashboard
                </a>
              </li>

              <li>
                <a
                  href="/login"
                  className="hover:text-green-400 transition"
                >
                  Login
                </a>
              </li>

              <li>
                <a
                  href="/register"
                  className="hover:text-green-400 transition"
                >
                  Register
                </a>
              </li>

            </ul>

          </div>

          {/* FEATURES */}
          <div>

            <h2 className="text-xl font-semibold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-gray-400">

              <li>
                Expense Tracking
              </li>

              <li>
                Secure Authentication
              </li>

              <li>
                Smart Analytics
              </li>

              <li>
                Budget Planning
              </li>

            </ul>

          </div>

          {/* CONTACT */}
          <div>

            <h2 className="text-xl font-semibold mb-4">
              Contact
            </h2>

            <ul className="space-y-3 text-gray-400">

              <li>
                Email:
                services@moneymap.com
              </li>

              <li>
                Phone:
                +91 9876543210
              </li>

              <li>
                Calicut, Kerala
              </li>

            </ul>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 MoneyMap. All Rights Reserved.
          </p>

          <div className="flex gap-5 text-gray-400">

            <a
              href="#"
              className="hover:text-green-400 transition"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-green-400 transition"
            >
              Terms
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}