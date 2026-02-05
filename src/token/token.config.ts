import { registerAs } from '@nestjs/config';

export default registerAs('tokens', () => ({
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
}));
