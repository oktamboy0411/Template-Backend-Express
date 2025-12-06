import bcrypt from 'bcryptjs'

import type { IBcrypt } from '@/types'

const { compare, genSalt, hash } = bcrypt as unknown as IBcrypt

export class HashingHelpers {
   public static async generatePassword(
      passwordString: string,
   ): Promise<string> {
      const salt = await genSalt(10)
      return hash(passwordString, salt)
   }
   public static async comparePassword(
      password: string,
      hashString: string,
   ): Promise<boolean> {
      return compare(password, hashString)
   }
}
