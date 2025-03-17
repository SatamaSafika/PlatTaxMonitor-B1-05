import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/db";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const login = async (email: string, password: string) => {
  const user = await prisma.akun_pengguna.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email not found");
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  return { user };
};

export const register = async (data: RegisterData) => {
  if (!data.email || !data.password || !data.username) {
    throw new Error("All fields are required");
  }

  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await prisma.akun_pengguna.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hash(data.password, 10);

  const user = await prisma.akun_pengguna.create({
    data: {
      email: data.email,
      username: data.username,
      password: hashedPassword,
    },
  });

  return { user };
};
