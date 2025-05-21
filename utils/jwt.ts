import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

type StringValue = `${number}${'m' | 'h'}`;

interface TokenPayload {
  id?: string;
  email: string;
  role: string;
}

export const generateToken = (
  payload: TokenPayload,
  expiresIn: StringValue = '1h'
): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload | JwtPayload => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
