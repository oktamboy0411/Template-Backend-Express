import type { ValidationChain } from 'express-validator'
import { body, param, query } from 'express-validator'

import { roleConstants, sectionConstants } from '@/constants'

const PASSWORD_MIN_LENGTH = 4
const PASSWORD_MAX_LENGTH = 16
const PAGE_MIN = 1
const LIMIT_MIN = 1
const LIMIT_MAX = 100
const PHONE_REGEX = /^\+998\d{9}$/

const ERROR_MESSAGES = {
   USERNAME_REQUIRED: 'Username is required.',
   USERNAME_STRING: 'Username must be a string.',
   USERNAME_EMPTY: 'Username cannot be empty.',
   PASSWORD_REQUIRED: 'Password is required.',
   PASSWORD_STRING: 'Password must be a string.',
   PASSWORD_LENGTH: `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long.`,
   PASSWORD_EMPTY: 'Password cannot be empty.',
   FULLNAME_REQUIRED: 'Fullname is required.',
   FULLNAME_STRING: 'Fullname must be a string.',
   FULLNAME_EMPTY: 'Fullname cannot be empty.',
   PHONE_REQUIRED: 'Phone number is required.',
   PHONE_STRING: 'Phone number must be a string.',
   PHONE_FORMAT: 'Phone number must match +998XXXXXXXXX format.',
   PHONE_EMPTY: 'Phone number cannot be empty.',
   ROLE_REQUIRED: 'Role is required.',
   ROLE_INVALID: 'Invalid role value.',
   ROLE_EMPTY: 'Role cannot be empty.',
   SECTION_EMPTY: 'Section cannot be empty.',
   SECTION_INVALID: 'Invalid section value.',
   USER_ID_REQUIRED: 'User ID is required.',
   USER_ID_MONGO: 'User ID must be a valid MongoDB ObjectId.',
   PAGE_RANGE: `Page must be an integer greater than or equal to ${PAGE_MIN}.`,
   LIMIT_RANGE: `Limit must be an integer between ${LIMIT_MIN} and ${LIMIT_MAX}.`,
   SEARCH_STRING: 'Search must be a string.',
} as const

export class UserValidator {
   public static create = (): ValidationChain[] => [
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

      body('fullname')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.FULLNAME_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.FULLNAME_STRING),

      body('phone')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.PHONE_REQUIRED)
         .isString()
         .withMessage(ERROR_MESSAGES.PHONE_STRING)
         .matches(PHONE_REGEX)
         .withMessage(ERROR_MESSAGES.PHONE_FORMAT),

      body('role')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.ROLE_REQUIRED)
         .isIn(Object.values(roleConstants))
         .withMessage(ERROR_MESSAGES.ROLE_INVALID),

      body('section')
         .optional()
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.SECTION_EMPTY)
         .isIn(Object.values(sectionConstants))
         .withMessage(ERROR_MESSAGES.SECTION_INVALID),
   ]

   public static update = (): ValidationChain[] => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.USER_ID_REQUIRED)
         .isMongoId()
         .withMessage(ERROR_MESSAGES.USER_ID_MONGO),

      body('username')
         .optional()
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.USERNAME_EMPTY)
         .isString()
         .withMessage(ERROR_MESSAGES.USERNAME_STRING),

      body('password')
         .optional()
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.PASSWORD_EMPTY)
         .isString()
         .withMessage(ERROR_MESSAGES.PASSWORD_STRING)
         .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
         .withMessage(ERROR_MESSAGES.PASSWORD_LENGTH),

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

      body('role')
         .optional()
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.ROLE_EMPTY)
         .isIn(Object.values(roleConstants))
         .withMessage(ERROR_MESSAGES.ROLE_INVALID),

      body('section')
         .optional()
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.SECTION_EMPTY)
         .isIn(Object.values(sectionConstants))
         .withMessage(ERROR_MESSAGES.SECTION_INVALID),
   ]

   public static getAll = (): ValidationChain[] => [
      query('page')
         .optional()
         .isInt({ min: PAGE_MIN })
         .withMessage(ERROR_MESSAGES.PAGE_RANGE),

      query('limit')
         .optional()
         .isInt({ min: LIMIT_MIN, max: LIMIT_MAX })
         .withMessage(ERROR_MESSAGES.LIMIT_RANGE),

      query('role')
         .optional()
         .isIn(Object.values(roleConstants))
         .withMessage(ERROR_MESSAGES.ROLE_INVALID),

      query('search')
         .optional()
         .isString()
         .withMessage(ERROR_MESSAGES.SEARCH_STRING),
   ]

   public static mongoId = (): ValidationChain[] => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage(ERROR_MESSAGES.USER_ID_REQUIRED)
         .bail()
         .isMongoId()
         .withMessage(ERROR_MESSAGES.USER_ID_MONGO),
   ]
}
