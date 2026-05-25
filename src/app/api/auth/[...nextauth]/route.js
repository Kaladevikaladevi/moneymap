import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordCorrect =
          await bcrypt.compare(
            credentials.password,
            user.password
          );

        if (!isPasswordCorrect) {
          throw new Error(
            "Invalid password"
          );
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
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

    // SAVE USER ID IN TOKEN
    async jwt({ token, user }) {

      if (user) {
        token.id = user.id;
      }

      return token;
    },

    // SEND USER ID TO SESSION
    async session({ session, token }) {

      if (session.user) {
        session.user.id = token.id;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
};