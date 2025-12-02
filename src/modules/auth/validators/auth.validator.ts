import { body } from 'express-validator'

export class AuthValidator {
   public static login = () => [
      body('username')
         .trim()
         .notEmpty()
         .withMessage('Username is required.')
         .isString()
         .withMessage('Username must be a string.'),

      body('password')
         .trim()
         .notEmpty()
         .withMessage('Password is required.')
         .isString()
         .withMessage('Password must be a string.')
         .isLength({ min: 4, max: 16 })
         .withMessage('Password must be between 4 and 16 characters long.'),
   ]

   public static signUpCeo = () => [
      body('username')
         .trim()
         .notEmpty()
         .withMessage('Username is required.')
         .isString()
         .withMessage('Username must be a string.'),

      body('password')
         .trim()
         .notEmpty()
         .withMessage('Password is required.')
         .isString()
         .withMessage('Password must be a string.')
         .isLength({ min: 4, max: 16 })
         .withMessage('Password must be between 4 and 16 characters long.'),

      body('reg_key')
         .trim()
         .notEmpty()
         .withMessage('Registration key is required.')
         .isString()
         .withMessage('Registration key must be a string.'),
   ]

   public static updateMe = () => [
      body('username')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('Username cannot be empty.')
         .isString()
         .withMessage('Username must be a string.'),

      body('fullname')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('Fullname cannot be empty.')
         .isString()
         .withMessage('Fullname must be a string.'),

      body('email')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('Email cannot be empty.')
         .isEmail()
         .withMessage('Email must be a valid email address.'),

      body('phone')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('Phone number cannot be empty.')
         .isString()
         .withMessage('Phone number must be a string.')
         .matches(/^\+998\d{9}$/)
         .withMessage('Phone number must match +998XXXXXXXXX format.'),

      body('license_number')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('License number cannot be empty.')
         .isString()
         .withMessage('License number must be a string.'),
   ]

   public static updatePassword = () => [
      body('old_password')
         .trim()
         .notEmpty()
         .withMessage('Current password is required.')
         .isString()
         .withMessage('Current password must be a string.')
         .isLength({ min: 4, max: 16 })
         .withMessage(
            'Current password must be between 4 and 16 characters long.',
         ),

      body('new_password')
         .trim()
         .notEmpty()
         .withMessage('New password is required.')
         .isString()
         .withMessage('New password must be a string.')
         .isLength({ min: 4, max: 16 })
         .withMessage('New password must be between 4 and 16 characters long.'),
   ]
}
