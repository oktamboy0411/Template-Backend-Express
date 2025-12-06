/* eslint-disable no-console */
import { connect } from 'mongoose'

import { MONGO_URI } from './secrets'

export const CONNECT_DB = async (): Promise<void> => {
   try {
      const { connections } = await connect(MONGO_URI)

      const [connection] = connections

      console.info(
         `[DB] Connected successfully to database: ${connection.name} at ${connection.host}:${connection.port}`,
      )
   } catch (error) {
      console.error(
         '[DB] Failed to connect to database:',
         error instanceof Error ? error.message : error,
      )
      throw error
   }
}
