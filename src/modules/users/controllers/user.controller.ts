import type { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { roleConstants, statusConstants } from '@/constants'
import type { ICustomRequest } from '@/types'
import { HashingHelpers, HttpException, asyncHandler } from '@/utils'

import type { IUserDocument } from '../models/user.model'
import { userModel } from '../models/user.model'

// Types for request bodies
interface IUserCreateInput {
   username: string
   password: string
   fullname: string
   phone: string
   role: IUserDocument['role']
   section?: IUserDocument['section']
}

interface IUserUpdateInput {
   fullname?: string
   username?: string
   phone?: string
   role?: IUserDocument['role']
   section?: IUserDocument['section']
   password?: string
}

// Constants
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const RADIX = 10

// Error messages
const ERROR_MESSAGES = {
   USERNAME_EXISTS: 'Username already in use!',
   PHONE_EXISTS: 'Phone number already in use!',
   USER_NOT_FOUND: 'User not found!',
} as const

// Success messages
const SUCCESS_MESSAGES = {
   USER_CREATED: 'User created successfully',
   USER_UPDATED: 'User updated successfully',
   USER_DELETED: 'User deleted successfully',
} as const

// Projection fields
const USER_LIST_PROJECTION =
   '_id username fullname phone role created_at status section'
const DUPLICATE_CHECK_PROJECTION = 'username phone'

/**
 * Helper to check for duplicate username
 */
const checkDuplicateUsername = (
   matches: Array<{ username?: string; phone?: string }>,
   username: string,
): void => {
   if (matches.some((m) => m.username === username)) {
      throw new HttpException(
         StatusCodes.BAD_REQUEST,
         ReasonPhrases.BAD_REQUEST,
         ERROR_MESSAGES.USERNAME_EXISTS,
      )
   }
}

/**
 * Helper to check for duplicate phone
 */
const checkDuplicatePhone = (
   matches: Array<{ username?: string; phone?: string }>,
   phone: string,
): void => {
   if (matches.some((m) => m.phone === phone)) {
      throw new HttpException(
         StatusCodes.BAD_REQUEST,
         ReasonPhrases.BAD_REQUEST,
         ERROR_MESSAGES.PHONE_EXISTS,
      )
   }
}

/**
 * Helper to build query object for user search
 */
const buildSearchQuery = (
   search: string,
   role: string,
): Record<string, unknown> => {
   const queryObj: Record<string, unknown> = {}

   if (search !== '') {
      queryObj.$or = [
         { username: { $regex: search, $options: 'i' } },
         { fullname: { $regex: search, $options: 'i' } },
         { phone: { $regex: search, $options: 'i' } },
      ]
   }

   if (role !== '') {
      queryObj.$and = [{ role }, { role: { $ne: roleConstants.CEO } }]
   } else {
      queryObj.role = { $ne: roleConstants.CEO }
   }

   return queryObj
}

/**
 * Helper to build pagination metadata
 */
const buildPaginationMetadata = (
   page: number,
   limit: number,
   total: number,
): {
   page: number
   limit: number
   total_items: number
   total_pages: number
   next_page: number | null
   prev_page: number | null
} => ({
   page,
   limit,
   total_items: total,
   total_pages: Math.ceil(total / limit),
   next_page: page * limit < total ? page + 1 : null,
   prev_page: page > 1 ? page - 1 : null,
})

/**
 * User controller class containing all user-related endpoint handlers
 */
export class UserController {
   /**
    * Create a new user
    */
   public static create = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const { username, password, fullname, phone, role, section } =
            req.body as IUserCreateInput

         const matches = await userModel
            .find({
               $or: [{ username }, { phone }],
            })
            .select(DUPLICATE_CHECK_PROJECTION)
            .lean()
            .exec()

         checkDuplicateUsername(matches, username)
         checkDuplicatePhone(matches, phone)

         const hashed = await HashingHelpers.generatePassword(password)

         await userModel.create({
            username,
            password: hashed,
            fullname,
            phone,
            role,
            section,
            status: statusConstants.ACTIVE,
         })

         res.status(StatusCodes.CREATED).json({
            success: true,
            message: SUCCESS_MESSAGES.USER_CREATED,
         })
      },
   )

   /**
    * Get all users with pagination and search
    */
   public static getAll = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const parsedPage = parseInt(req.query.page as string, RADIX)
         const page = Number.isNaN(parsedPage) ? DEFAULT_PAGE : parsedPage

         const parsedLimit = parseInt(req.query.limit as string, RADIX)
         const limit = Number.isNaN(parsedLimit) ? DEFAULT_LIMIT : parsedLimit

         const search =
            req.query.search !== undefined ? (req.query.search as string) : ''
         const role =
            req.query.role !== undefined ? (req.query.role as string) : ''

         const queryObj = buildSearchQuery(search, role)

         const [result, total] = await Promise.all([
            userModel
               .find(queryObj)
               .select(USER_LIST_PROJECTION)
               .sort({ created_at: -1 })
               .skip((page - 1) * limit)
               .limit(limit)
               .lean()
               .exec(),
            userModel.countDocuments(queryObj).exec(),
         ])

         res.status(StatusCodes.OK).json({
            success: true,
            data: result,
            pagination: buildPaginationMetadata(page, limit, total),
         })
      },
   )

   /**
    * Get a single user by ID
    */
   public static getById = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const { id } = req.params

         const user = await userModel.findById(id).lean()

         if (user === null) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               ERROR_MESSAGES.USER_NOT_FOUND,
            )
         }

         res.status(StatusCodes.OK).json({ success: true, data: user })
      },
   )

   /**
    * Update an existing user
    */
   public static update = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const { id } = req.params
         const { fullname, username, phone, role, section, password } =
            req.body as IUserUpdateInput

         const user = await userModel.findById(id).select('+password')

         if (user === null) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               ERROR_MESSAGES.USER_NOT_FOUND,
            )
         }

         const orConditions: Array<Record<string, string>> = []

         if (username !== undefined && username !== '') {
            orConditions.push({ username })
         }
         if (phone !== undefined && phone !== '') {
            orConditions.push({ phone })
         }

         const matches =
            orConditions.length > 0
               ? await userModel
                    .find({ $or: orConditions })
                    .select(DUPLICATE_CHECK_PROJECTION)
                    .lean()
                    .exec()
               : []

         const updateData: Partial<IUserDocument> = {}

         if (fullname !== undefined && fullname !== '') {
            updateData.fullname = fullname
         }

         if (
            username !== undefined &&
            username !== '' &&
            username !== user.username
         ) {
            checkDuplicateUsername(matches, username)
            updateData.username = username
         }

         if (
            phone !== undefined &&
            phone !== '' &&
            phone !== (user.phone ?? '')
         ) {
            checkDuplicatePhone(matches, phone)
            updateData.phone = phone
         }

         if (role !== undefined) {
            updateData.role = role
         }
         if (section !== undefined) {
            updateData.section = section
         }

         if (password !== undefined && password !== '') {
            const isSamePassword = await HashingHelpers.comparePassword(
               password,
               user.password,
            )
            if (!isSamePassword) {
               const hashedPassword =
                  await HashingHelpers.generatePassword(password)
               updateData.password = hashedPassword
            }
         }

         await userModel.findByIdAndUpdate(id, { $set: updateData })

         res.status(StatusCodes.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.USER_UPDATED,
         })
      },
   )

   /**
    * Delete a user by ID
    */
   public static delete = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const { id } = req.params

         const user = await userModel.findByIdAndDelete(id)

         if (user === null) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               ERROR_MESSAGES.USER_NOT_FOUND,
            )
         }

         res.status(StatusCodes.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.USER_DELETED,
         })
      },
   )
}
