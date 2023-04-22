import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'email is not correct').isEmail(),
  body('password', 'Password length should be 4 or more').isLength({ min: 4 }),
  body('fullName', 'Enter your name').isLength({ min: 3 }),
  body('avatarUrl', 'Wrong avatar URL').optional().isURL(),
]
