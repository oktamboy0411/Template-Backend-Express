export interface IBcrypt {
   compare: (data: string | Buffer, encrypted: string) => Promise<boolean>
   genSalt: (rounds?: number, minor?: 'a' | 'b') => Promise<string>
   hash: (a: string, b: string) => string
}
