import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { signInSchema } from "@/schemas/signInSchema";
import { z } from "zod";

// Ensure you define the correct type for credentials
type Credentials = z.infer<typeof signInSchema>;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined): Promise<User | null> {
        await dbConnect();

        // Validate the credentials (you can use Zod to parse/validate)
        if (!credentials || !credentials.identifier || !credentials.password) {
          throw new Error("Missing Credentials");
        }

        try {
          // Find the user based on either email or username
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
          });

          if (!user) {
            throw new Error("No user found with this email/username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

          if (isPasswordMatch) {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (err) {
          console.log(err);
          
          throw new Error("Some Thing went wrong");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user || {};
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Make sure .env file has NEXTAUTH_SECRET
};
