import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  console.log("Request received at /api/editpassword");
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  console.log("Request body:", { currentPassword, newPassword });

  try {
    const user = await prisma.akun_pengguna.findUnique({
      where: { email: session.user?.email ?? "" },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 10);
    await prisma.akun_pengguna.update({
      where: { email: session.user?.email ?? "" },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Removed unused handleSubmit function to resolve the error.