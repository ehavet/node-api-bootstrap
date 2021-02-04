'use strict'

/*
* Special operations code re-identification
* purpose :
* This migration is used to update 'special_operations_code' and 'special_operations_code_applied_at'
* for all previous policy anterior at 2020-10-28 00:00:00.000000 +00:00
*/
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('UPDATE policy ' +
      'SET special_operations_code = \'SEMESTER1\' ,' +
      'special_operations_code_applied_at = updated_at ' +
      'WHERE  partner_code=\'essca\' ' +
      'AND special_operations_code is NULL ' +
      'AND nb_months_due=5 ' +
      'AND created_at < \'2020-10-28 00:00:00.000000 +00:00\''
    )

    await queryInterface.sequelize.query('UPDATE policy ' +
      'SET special_operations_code = \'FULLYEAR\' ,' +
      'special_operations_code_applied_at = updated_at ' +
      'WHERE  partner_code=\'essca\' ' +
      'AND special_operations_code is NULL ' +
      'AND nb_months_due=10 ' +
      'AND created_at < \'2020-10-28 00:00:00.000000 +00:00\''
    )
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query('UPDATE policy ' +
      'SET special_operations_code=NULL, ' +
      'special_operations_code_applied_at=NULL ' +
      'WHERE partner_code=\'essca\' ' +
      'AND created_at < \'2020-10-28 00:00:00.000000 +00:00\'')
  }
}
