import { User } from '@prisma/client';
import jwt from 'jsonwebtoken'

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET || 'secretpassword';

const generateToken = (payload: User) :string => {
  return jwt.sign({ id: payload.id }, jwtAccessSecret, {
    expiresIn: 86400
  })
}

export { generateToken }
