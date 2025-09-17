import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // <-- use this path


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
