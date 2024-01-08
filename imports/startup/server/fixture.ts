import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { initRoles } from './initRoles'
Meteor.startup(async () => {
  // Super
  const superAccount = Accounts.findUserByUsername('super')
  if (!superAccount) {

    const user = {
      username: 'keke',
      email: 'super@rabbit.com',
    
      password: '123456',
      profile: {
        fullName: 'Super',
        status: 'Active',  
        "roles": ["super"]
   
      },   
    }
    Accounts.createUser(user)
  }
  // Fixture role
  await initRoles();

})