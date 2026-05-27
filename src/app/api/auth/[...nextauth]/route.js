import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";

import User from "@/models/User";

export const authOptions = {

  providers: [

    CredentialsProvider({

      name: "Credentials",

      credentials: {

        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {

        try {

          // CHECK EMPTY INPUTS
          if (
            !credentials?.email ||
            !credentials?.password
          ) {
            throw new Error("Missing email or password");
          }

          // CONNECT DATABASE
          await connectDB();

          // FIND USER
          const user = await User.findOne({
            email: credentials.email,
          });

          // USER NOT FOUND
          if (!user) {

            console.log("User not found");

            throw new Error("Invalid email or password");
          }

          // CHECK PASSWORD
          const isPasswordCorrect =
            await bcrypt.compare(
              credentials.password,
              user.password
            );

          // WRONG PASSWORD
          if (!isPasswordCorrect) {

            console.log("Wrong password");

            throw new Error("Invalid email or password");
          }

          // SUCCESS LOGIN
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };

        } catch (error) {

          console.log(
            "NEXTAUTH LOGIN ERROR:",
            error
          );

          throw new Error(
            error.message || "Login failed"
          );
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {

    async jwt({ token, user }) {

      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {

      if (session.user) {
        session.user.id = token.id;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };