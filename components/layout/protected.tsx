import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

const ProtectedPage = async () => {
  const session = await getServerSession(authOptions);

console.log("session", session);
  if (!session) {
    // redirect("/sign-in");
  }
};

export default ProtectedPage;