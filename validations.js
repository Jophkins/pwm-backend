import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'email is not correct').isEmail(),
  body('password', 'Password length should be 4 or more').isLength({ min: 4 })
]

export const registerValidation = [
  body('email', 'email is not correct').isEmail(),
  body('password', 'Password length should be 4 or more').isLength({ min: 4 }),
  body('fullName', 'Enter your name').isLength({ min: 3 }),
  body('avatarUrl', 'Wrong avatar URL').optional().isURL(),
]
export const postCreateValidation = [
  body('title', 'You have to enter a post title').isLength({ min: 3 }).isString(),
  body('text', 'You have to enter a post body text').isLength({ min: 10 }).isString(),
  body('tags', 'Wrong tags, Array is expecting').optional().isString(),
  body('imageUrl', 'Wrong image URL').optional().isString(),
]

