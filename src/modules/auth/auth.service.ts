import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';
import { AppError } from '../../utils/errors';

export async function register(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email is already registered', 409);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, passwordHash } });
  return issueToken(user.id, user.email, user.role);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid email or password', 401);
  }
  return issueToken(user.id, user.email, user.role);
}

function issueToken(id: number, email: string, role: 'USER' | 'ADMIN') {
  return { token: jwt.sign({ email, role }, env.JWT_SECRET, { subject: String(id), expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }), role };
}
