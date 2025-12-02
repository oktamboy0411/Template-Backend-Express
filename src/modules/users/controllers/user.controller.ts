import { RoleConstants, StatusConstants } from '@/constants'
import { HashingHelpers, HttpException, asyncHandler } from '@/utils'
import e from 'cors'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { UserDocumentI, UserModel } from '../models/user.model'

export class UserController {
   public static create = asyncHandler(async (req, res) => {
      const {
         username,
         password,
         fullname,
         email,
         phone,
         role,
         section,
         permissions,
         license_number,
      } = req.body as UserDocumentI

      const matches = await UserModel.find({
         $or: [{ username }, { email }, { phone }],
      })
         .select('username email phone')
         .lean()
         .exec()

      if (matches.some(m => m.username === username)) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Username already in use!',
         )
      }

      if (matches.some(m => m.email === email)) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Email already in use!',
         )
      }

      if (matches.some(m => m.phone === phone)) {
         throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST,
            'Phone number already in use!',
         )
      }

      const hashed = await HashingHelpers.generatePassword(password)

      await UserModel.create({
         username,
         password: hashed,
         fullname,
         email,
         phone,
         role,
         section,
         permissions,
         status: StatusConstants.ACTIVE,
         license_number,
      })

      res.status(StatusCodes.CREATED).json({
         success: true,
         message: 'User created successfully',
      })
   })

   public static getAll = asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1
      const limit = parseInt(req.query.limit as string, 10) || 10
      const search = (req.query.search as string) || ''
      const role = (req.query.role as string) || ''

      const queryObj: any = {}
      if (search) {
         queryObj.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { fullname: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
         ]
      }

      if (role) {
         queryObj.$and = [{ role: role }, { role: { $ne: RoleConstants.CEO } }]
      } else {
         queryObj.role = { $ne: RoleConstants.CEO }
      }

      const projection =
         '_id username fullname email phone role created_at status section'

      const [result, total] = await Promise.all([
         UserModel.find(queryObj)
            .select(projection)
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec(),
         UserModel.countDocuments(queryObj).exec(),
      ])

      res.status(StatusCodes.OK).json({
         success: true,
         data: result,
         pagination: {
            page,
            limit,
            total_items: total,
            total_pages: Math.ceil(total / limit),
            next_page: page * limit < total ? page + 1 : null,
            prev_page: page > 1 ? page - 1 : null,
         },
      })
   })

   public static getById = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const user = await UserModel.findById(id).lean()
      if (!user) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'User not found!',
         )
      }
      res.status(StatusCodes.OK).json({ success: true, data: user })
   })

   public static update = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const {
         fullname,
         username,
         email,
         phone,
         role,
         section,
         license_number,
         password,
         permissions,
      } = req.body as UserDocumentI

      const user = await UserModel.findById(id).select('+password')
      if (!user) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'User not found!',
         )
      }

      const orConditions: any[] = []

      if (username) orConditions.push({ username })
      if (email) orConditions.push({ email })
      if (phone) orConditions.push({ phone })

      const matches = orConditions.length
         ? await UserModel.find({ $or: orConditions })
              .select('username email phone')
              .lean()
              .exec()
         : []

      const updateData: any = {}

      if (fullname) updateData.fullname = fullname

      if (username && username !== user.username) {
         if (matches.some(m => m.username === username)) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               'Username already in use!',
            )
         }
         updateData.username = username
      }

      if (email && email !== user.email) {
         if (matches.some(m => m.email === email)) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               'Email already in use!',
            )
         }
         updateData.email = email
      }

      if (phone && phone !== user.phone) {
         if (matches.some(m => m.phone === phone)) {
            throw new HttpException(
               StatusCodes.BAD_REQUEST,
               ReasonPhrases.BAD_REQUEST,
               'Phone number already in use!',
            )
         }
         updateData.phone = phone
      }

      if (role) updateData.role = role
      if (section) updateData.section = section
      if (license_number) updateData.license_number = license_number
      if (permissions) updateData.permissions = permissions

      if (password) {
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

      await UserModel.findByIdAndUpdate(id, { $set: updateData })

      res.status(StatusCodes.OK).json({
         success: true,
         message: 'User updated successfully',
      })
   })

   public static delete = asyncHandler(async (req, res) => {
      const { id } = req.params as any
      const user = await UserModel.findByIdAndDelete(id)
      if (!user) {
         throw new HttpException(
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
            'User not found!',
         )
      }

      res.status(StatusCodes.OK).json({
         success: true,
         message: 'User deleted successfully',
      })
   })
}
