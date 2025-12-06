import type { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { roleConstants } from '@/constants'
import type { ICustomRequest } from '@/types'
import {
   HashingHelpers,
   HttpException,
   JwtHelpers,
   REG_KEY,
   asyncHandler,
} from '@/utils'

import { userModel } from '../../users/models/user.model'

const TOKEN_EXPIRATION = '7d'

const ERROR_MESSAGES = {
   INVALID_CREDENTIALS: 'Invalid username or password!',
   INVALID_REG_KEY: 'Invalid registration key!',
   CEO_EXISTS: 'There is already a CEO registered!',
   USERNAME_EXISTS: 'Username already in use!',
   PHONE_EXISTS: 'Phone number already in use!',
   OLD_PASSWORD_INCORRECT: 'Old password is incorrect!',
   PASSWORD_SAME: 'New password cannot be same as old password!',
   USER_NOT_FOUND: 'User not found!',
} as const

const SUCCESS_MESSAGES = {
   CEO_CREATED: 'CEO created successfully',
   PROFILE_UPDATED: 'Profile updated successfully',
   PASSWORD_UPDATED: 'Password updated successfully',
} as const

interface ILoginInput {
   username: string
   password: string
}

interface ISignUpCeoInput {
   username: string
   password: string
   regKey: string
}

interface IUpdateMeInput {
   fullname?: string
   username?: string
   phone?: string
}

interface IUpdatePasswordInput {
   oldPassword: string
   newPassword: string
}

interface IUserMatch {
   username?: string
   phone?: string
}

export class AuthController {
   public static login = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const { username, password } = req.body as ILoginInput

         const user = await userModel.findOne({ username }).select('+password')

         if (user === null) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.INVALID_CREDENTIALS,
            )
         }

         const isMatch = await HashingHelpers.comparePassword(
            password,
            user.password,
         )
         if (!isMatch) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.INVALID_CREDENTIALS,
            )
         }

         const accessToken = JwtHelpers.sign(
            user._id.toString(),
            TOKEN_EXPIRATION,
         )

         res.status(StatusCodes.OK).json({
            success: true,
            accessToken,
         })
      },
   )

   public static signUpCeo = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const { username, password, regKey } = req.body as ISignUpCeoInput

         if (regKey !== REG_KEY) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.INVALID_REG_KEY,
            )
         }

         const [existingCeo, existingUser] = await Promise.all([
            userModel.findOne({ role: roleConstants.CEO }),
            userModel.findOne({ username }),
         ])

         if (existingCeo !== null) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.CEO_EXISTS,
            )
         }

         if (existingUser !== null) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.USERNAME_EXISTS,
            )
         }

         const hashed = await HashingHelpers.generatePassword(password)

         await userModel.create({
            role: roleConstants.CEO,
            password: hashed,
            username,
         })

         res.status(StatusCodes.CREATED).json({
            success: true,
            message: SUCCESS_MESSAGES.CEO_CREATED,
         })
      },
   )

   public static getMe = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const user = req.user

         res.status(StatusCodes.OK).json({ success: true, data: user })
      },
   )

   public static updateMe = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const user = req.user
         const { fullname, username, phone } = req.body as IUpdateMeInput

         const orConditions: Array<{ username?: string; phone?: string }> = []
         const updateData: Partial<IUpdateMeInput> = {}

         if (username !== undefined && username !== '') {
            orConditions.push({ username })
         }
         if (phone !== undefined && phone !== '') {
            orConditions.push({ phone })
         }

         const matches: IUserMatch[] =
            orConditions.length > 0
               ? await userModel
                    .find({ $or: orConditions })
                    .select('username phone')
                    .lean()
                    .exec()
               : []

         if (fullname !== undefined && fullname !== '') {
            updateData.fullname = fullname
         }

         if (
            username !== undefined &&
            username !== '' &&
            username !== user?.username
         ) {
            if (matches.some((m) => m.username === username)) {
               throw new HttpException(
                  StatusCodes.BAD_REQUEST,
                  ReasonPhrases.BAD_REQUEST,
                  ERROR_MESSAGES.USERNAME_EXISTS,
               )
            }
            updateData.username = username
         }

         if (phone !== undefined && phone !== '' && phone !== user?.phone) {
            if (matches.some((m) => m.phone === phone)) {
               throw new HttpException(
                  StatusCodes.BAD_REQUEST,
                  ReasonPhrases.BAD_REQUEST,
                  ERROR_MESSAGES.PHONE_EXISTS,
               )
            }
            updateData.phone = phone
         }

         await userModel.findByIdAndUpdate(user?._id, { $set: updateData })

         res.status(StatusCodes.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.PROFILE_UPDATED,
         })
      },
   )

   public static updatePassword = asyncHandler(
      async (req: ICustomRequest, res: Response) => {
         const user = req.user
         const { oldPassword, newPassword } = req.body as IUpdatePasswordInput

         const oldUser = await userModel.findById(user?._id).select('+password')

         if (oldUser?.password === undefined) {
            throw new HttpException(
               StatusCodes.NOT_FOUND,
               ReasonPhrases.NOT_FOUND,
               ERROR_MESSAGES.USER_NOT_FOUND,
            )
         }

         const [isMatch, isNewMatch] = await Promise.all([
            HashingHelpers.comparePassword(oldPassword, oldUser.password),
            HashingHelpers.comparePassword(newPassword, oldUser.password),
         ])

         if (!isMatch) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.OLD_PASSWORD_INCORRECT,
            )
         }

         if (isNewMatch) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               ERROR_MESSAGES.PASSWORD_SAME,
            )
         }

         const hashedPassword =
            await HashingHelpers.generatePassword(newPassword)

         await userModel.findByIdAndUpdate(user?._id, {
            password: hashedPassword,
         })

         res.status(StatusCodes.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.PASSWORD_UPDATED,
         })
      },
   )
}
