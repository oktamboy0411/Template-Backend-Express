import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { roleConstants } from '@/constants'
import {
   HashingHelpers,
   HttpException,
   JwtHelpers,
   REG_KEY,
   asyncHandler,
} from '@/utils'

import { userModel } from '../../users/models/user.model'

export class AuthController {
   public static login = asyncHandler(async (req, res) => {
      const { username, password } = req.body

      const user = await userModel.findOne({ username }).select('+password')

      if (!user) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Invalid username or password!',
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
            'Invalid username or password!',
         )
      }

      const accessToken = JwtHelpers.sign(user._id.toString(), '7d')

      res.status(StatusCodes.OK).json({
         success: true,
         accessToken,
      })
   })

   public static signUpCeo = asyncHandler(async (req, res) => {
      const { username, password, regKey } = req.body

      if (regKey !== REG_KEY) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Invalid registration key!',
         )
      }

      const [existingCeo, existingUser] = await Promise.all([
         userModel.findOne({ role: roleConstants.CEO }),
         userModel.findOne({ username }),
      ])

      if (existingCeo) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'There is already a CEO registered!',
         )
      }

      if (existingUser) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Username already in use!',
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
         message: 'CEO created successfully',
      })
   })

   public static getMe = asyncHandler(async (req, res) => {
      const user = req.user

      res.status(StatusCodes.OK).json({ success: true, data: user })
   })

   public static updateMe = asyncHandler(async (req, res) => {
      const user = req.user
      const { fullname, username, email, phone, licenseNumber } = req.body

      const orConditions: any[] = []
      const updateData: any = {}

      if (username) orConditions.push({ username })
      if (email) orConditions.push({ email })
      if (phone) orConditions.push({ phone })

      const matches = orConditions.length
         ? await userModel
              .find({ $or: orConditions })
              .select('username email phone')
              .lean()
              .exec()
         : []

      if (fullname) updateData.fullname = fullname
      if (licenseNumber) updateData.licenseNumber = licenseNumber

      if (username && username !== user?.username) {
         if (matches.some((m) => m.username === username)) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               'Username already in use!',
            )
         }
         updateData.username = username
      }

      if (email && email !== user?.email) {
         if (matches.some((m) => m.email === email)) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               'Email already in use!',
            )
         }
         updateData.email = email
      }

      if (phone && phone !== user?.phone) {
         if (matches.some((m) => m.phone === phone)) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               'Phone number already in use!',
            )
         }
         updateData.phone = phone
      }

      await userModel.findByIdAndUpdate(user?._id, { $set: updateData })

      res.status(StatusCodes.OK).json({
         success: true,
         message: 'Profile updated successfully',
      })
   })

   public static updatePassword = asyncHandler(async (req, res) => {
      const user = req.user
      const { oldPassword, newPassword } = req.body as any

      const oldUser = await userModel.findById(user?._id).select('+password')

      const [isMatch, isNewMatch] = await Promise.all([
         HashingHelpers.comparePassword(oldPassword, oldUser?.password || ''),
         HashingHelpers.comparePassword(newPassword, oldUser?.password || ''),
      ])

      if (!isMatch) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Old password is incorrect!',
         )
      }

      if (isNewMatch) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'New password cannot be same as old password!',
         )
      }

      const hashedPassword = await HashingHelpers.generatePassword(newPassword)

      await userModel.findByIdAndUpdate(user?._id, { password: hashedPassword })

      res.status(StatusCodes.OK).json({
         success: true,
         message: 'Password updated successfully',
      })
   })
}
