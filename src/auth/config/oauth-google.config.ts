import { registerAs } from '@nestjs/config';

export default registerAs('oauth_google', () => ({
  clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
  clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.OAUTH_GOOGLE_URL,
}));
