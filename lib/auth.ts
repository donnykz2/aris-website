import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

export default prisma;
