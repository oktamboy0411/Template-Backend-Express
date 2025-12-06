import bcrypt from 'bcryptjs'

import type { IBcrypt } from '@/types'

const { compare, genSalt, hash } = bcrypt as unknown as IBcrypt

const SALT_ROUNDS = 10

export class HashingHelpers {
   public static async generatePassword(password: string): Promise<string> {
      const salt = await genSalt(SALT_ROUNDS)
      return hash(password, salt)
   }

   public static comparePassword(
      password: string,
      hashedPassword: string,
   ): Promise<boolean> {
      return compare(password, hashedPassword)
   }
}
