export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  sub: number;
  email: string;
};

export type TokenDecoded = {
  sub: number;
  email: string;
  iat: number;
  exp: number;
};
