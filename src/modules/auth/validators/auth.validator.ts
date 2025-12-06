import { type ValidationChain, body } from 'express-validator'

const PASSWORD_MIN_LENGTH = 4
const PASSWORD_MAX_LENGTH = 16

const PHONE_REGEX = /^\+998\d{9}$/

const ERROR_MESSAGES = {
   USERNAME_REQUIRED: 'Username is required.',
   USERNAME_EMPTY: 'Username cannot be empty.',
   USERNAME_STRING: 'Username must be a string.',
   PASSWORD_REQUIRED: 'Password is required.',
   PASSWORD_STRING: 'Password must be a string.',
   PASSWORD_LENGTH: `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long.`,
   REG_KEY_REQUIRED: 'Registration key is required.',
   REG_KEY_STRING: 'Registration key must be a string.',
   FULLNAME_EMPTY: 'Fullname cannot be empty.',
   FULLNAME_STRING: 'Fullname must be a string.',
   PHONE_EMPTY: 'Phone number cannot be empty.',
   PHONE_STRING: 'Phone number must be a string.',
   PHONE_FORMAT: 'Phone number must match +998XXXXXXXXX format.',
   OLD_PASSWORD_REQUIRED: 'Current password is required.',
   OLD_PASSWORD_STRING: 'Current password must be a string.',
   OLD_PASSWORD_LENGTH: `Current password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long.`,
   NEW_PASSWORD_REQUIRED: 'New password is required.',
   NEW_PASSWORD_STRING: 'New password must be a string.',
   NEW_PASSWORD_LENGTH: `New password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long.`,
} as const

export class AuthValidator {
   public static login = (): ValidationChain[] => [
      body('username')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.USERNAME_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.USERNAME_STRING),

      body('password')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.PASSWORD_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.PASSWORD_STRING)
         .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
         .withMessage(ERROR_MESSAGES.PASSWORD_LENGTH),
   ]

   public static signUpCeo = (): ValidationChain[] => [
      body('username')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.USERNAME_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.USERNAME_STRING),

      body('password')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.PASSWORD_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.PASSWORD_STRING)
         .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
         .withMessage(ERROR_MESSAGES.PASSWORD_LENGTH),

      body('regKey')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.REG_KEY_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.REG_KEY_STRING),
   ]

   public static updateMe = (): ValidationChain[] => [
      body('username')
         .optional()
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.USERNAME_EMPTY)
         .isString()
         .withMessage(ERROR_MESSAGES.USERNAME_STRING),

      body('fullname')
         .optional()
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.FULLNAME_EMPTY)
         .isString()
         .withMessage(ERROR_MESSAGES.FULLNAME_STRING),

      body('phone')
         .optional()
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.PHONE_EMPTY)
         .isString()
         .withMessage(ERROR_MESSAGES.PHONE_STRING)
         .matches(PHONE_REGEX)
         .withMessage(ERROR_MESSAGES.PHONE_FORMAT),
   ]

   public static updatePassword = (): ValidationChain[] => [
      body('oldPassword')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.OLD_PASSWORD_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.OLD_PASSWORD_STRING)
         .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
         .withMessage(ERROR_MESSAGES.OLD_PASSWORD_LENGTH),

      body('newPassword')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.NEW_PASSWORD_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.NEW_PASSWORD_STRING)
         .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
         .withMessage(ERROR_MESSAGES.NEW_PASSWORD_LENGTH),
   ]
}
