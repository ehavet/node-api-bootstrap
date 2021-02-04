import { DatabaseHealthChecker } from './database-health-checker'

export interface CheckApplicationReadiness {
    (): Promise<boolean>
}

export namespace CheckApplicationReadiness {
    export function factory (
      databaseHealthChecker: DatabaseHealthChecker
    ): CheckApplicationReadiness {
      return async () => {
        return await databaseHealthChecker.isConnectionEstablished()
      }
    }
}
