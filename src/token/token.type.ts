import { Role } from 'prisma/generated/prisma/client';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  sub: number;
  email: string;
  role: Role;
};

export type TokenDecoded = {
  sub: number;
  email: string;
  role: Role;
  iat: number;
  exp: number;
};
