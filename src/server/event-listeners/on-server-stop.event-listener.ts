import { Sequelize } from 'sequelize-typescript'

export function listenServerStopEvent (sequelize: Sequelize): any {
  return () => {
    sequelize.close()
  }
}
