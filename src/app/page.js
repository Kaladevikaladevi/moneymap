import Navbar from "@/src/components/navbar"
import Footer from "@/src/components/footer"
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          MoneyMap
        </h1>

        <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-8">
          Track your expenses, manage your money,
          and take control of your financial life
          with a modern and secure expense manager.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">

          <a
            href="/register"
            className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-xl text-lg font-semibold shadow-lg"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="border border-white hover:bg-white hover:text-black transition px-6 py-3 rounded-xl text-lg font-semibold"
          >
            Login
          </a>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20">

        <h2 className="text-4xl font-bold text-center mb-16">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* CARD 1 */}
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800 hover:scale-105 transition">

            <h3 className="text-2xl font-bold mb-4 text-green-400">
              Expense Tracking
            </h3>

            <p className="text-gray-300">
              Add, update, and delete expenses
              easily with real-time updates.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800 hover:scale-105 transition">

            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              Smart Analytics
            </h3>

            <p className="text-gray-300">
              Analyze your spending patterns and
              manage your budget effectively.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800 hover:scale-105 transition">

            <h3 className="text-2xl font-bold mb-4 text-pink-400">
              Secure Authentication
            </h3>

            <p className="text-gray-300">
              Protected routes and secure login
              system using NextAuth.
            </p>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 py-20 bg-gray-950">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-8">
            Why Choose MoneyMap?
          </h2>

          <p className="text-gray-300 text-lg leading-8">
            MoneyMap is built using modern
            technologies like Next.js, MongoDB,
            TailwindCSS, and SWR to provide a fast,
            responsive, and powerful financial
            management experience.
          </p>

        </div>
      </section>

      {/* FOOTER */}
      
       <Footer /> 

    </main>
  );
}