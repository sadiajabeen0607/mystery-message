import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    isVerified: boolean;
    isAcceptingMessage: boolean; // ✅ Ensure it matches the database field
    username: string;
  }

  interface Session {
    user: User & DefaultSession["user"]; // ✅ Ensures consistency
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    isVerified: boolean;
    isAcceptingMessage: boolean; // ✅ Matches User interface
    username: string;
  }
}
