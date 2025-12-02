import { body, param, query } from 'express-validator'

import {
   PermissionConstants,
   RoleConstants,
   SectionConstants,
} from '../../../constants'

export class UserValidator {
   public static create = () => [
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

      body('fullname')
         .trim()
         .notEmpty()
         .withMessage('Fullname is required.')
         .isString()
         .withMessage('Fullname must be a string.'),

      body('email')
         .trim()
         .notEmpty()
         .withMessage('Email is required.')
         .isEmail()
         .withMessage('Email must be a valid email address.'),

      body('phone')
         .trim()
         .notEmpty()
         .withMessage('Phone number is required.')
         .isString()
         .withMessage('Phone number must be a string.')
         .matches(/^\+998\d{9}$/)
         .withMessage('Phone number must match +998XXXXXXXXX format.'),

      body('role')
         .trim()
         .notEmpty()
         .withMessage('Role is required.')
         .isIn(Object.values(RoleConstants))
         .withMessage('Invalid role value.'),

      body('section')
         .trim()
         .notEmpty()
         .withMessage('Section is required.')
         .isIn(Object.values(SectionConstants))
         .withMessage('Invalid section value.'),

      body('license_number')
         .trim()
         .notEmpty()
         .withMessage('License number is required.')
         .isString()
         .withMessage('License number must be a string.'),

      body('permissions')
         .isArray({ min: 1 })
         .withMessage('Permissions must be an array of strings.'),
      body('permissions.*')
         .isIn(Object.values(PermissionConstants))
         .withMessage('Invalid permission value.'),
   ]

   public static update = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('User ID is required.')
         .isMongoId()
         .withMessage('User ID must be a valid Mongo ID.'),

      body('username')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('Username cannot be empty.')
         .isString()
         .withMessage('Username must be a string.'),

      body('password')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('Password cannot be empty.')
         .isString()
         .withMessage('Password must be a string.')
         .isLength({ min: 4, max: 16 })
         .withMessage('Password must be between 4 and 16 characters long.'),

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

      body('role')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('Role cannot be empty.')
         .isIn(Object.values(RoleConstants))
         .withMessage('Invalid role value.'),

      body('section')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('Section cannot be empty.')
         .isIn(Object.values(SectionConstants))
         .withMessage('Invalid section value.'),

      body('license_number')
         .optional()
         .trim()
         .notEmpty()
         .withMessage('License number cannot be empty.')
         .isString()
         .withMessage('License number must be a string.'),

      body('permissions')
         .optional()
         .isArray()
         .withMessage('Permissions must be an array of strings.'),
      body('permissions.*')
         .optional()
         .isIn(Object.values(PermissionConstants))
         .withMessage('Invalid permission value.'),
   ]

   public static getAll = () => [
      query('page')
         .optional()
         .isInt({ min: 1, max: 1000 })
         .withMessage('Page must be an integer between 1 and 1000.'),

      query('limit')
         .optional()
         .isInt({ min: 1, max: 100 })
         .withMessage('Limit must be an integer between 1 and 100.'),

      query('role')
         .optional()
         .isIn(Object.values(RoleConstants))
         .withMessage('Invalid role value.'),

      query('search')
         .optional()
         .isString()
         .withMessage('Search must be a string.'),
   ]

   public static mongoId = () => [
      param('id')
         .trim()
         .notEmpty()
         .withMessage('User ID is required.')
         .bail() // agar bo‘sh bo‘lsa, keyingi tekshiruvni to‘xtatadi
         .isMongoId()
         .withMessage('User ID must be a valid MongoDB ObjectId.'),
   ]
}
