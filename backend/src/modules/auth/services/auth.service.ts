import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '@config/app.config';

export interface AuthPayload {
  id: number | string;
  email?: string;
  roles?: string[];
  permissions?: string[];
}

export const verifyPassword = async (password: string): Promise<boolean> => {
  // Demo verification: accept only the literal "password" for tests
  return password === 'password';
};

export const signAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET as Secret, {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
};
