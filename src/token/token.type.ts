export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  sub: number;
  phone: string;
};

export type TokenDecoded = {
  sub: number;
  phone: string;
  iat: number;
  exp: number;
};
