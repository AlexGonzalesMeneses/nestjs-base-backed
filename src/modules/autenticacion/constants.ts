import * as dotenv from 'dotenv';

export const jwtConstants = {
  secret: dotenv.config().parsed.JWT_SECRET,
  expiresIn: dotenv.config().parsed.JWT_EXPIRES_IN,
};
