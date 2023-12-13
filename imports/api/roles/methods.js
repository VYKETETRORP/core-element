import { Meteor } from 'meteor/meteor'
import RoleGroup from "./roleGroup";
import Role from './roles';
Meteor.methods({
  getRoleGroupById(_id) {
    return RoleGroup.findOne({ _id })
  },
  
  getRoelGroups({selector}){
    return RoleGroup.find(selector).fetch()
  },
  insertRoleGroup(doc) {
    return RoleGroup.insert(doc)
  },
  updateRoleGroup(doc) {
    try {
      const exist = RoleGroup.findOne({ _id:doc._id,})
      if (!exist) throw `This recored deleted!`

      return RoleGroup.update({_id:doc._id, }, { $set: doc })
    } catch (error: any) {
      throw new Error('update role group error', error)
    }
  },
  removeRoleGroupById({id}) {
    try {
      const exist = RoleGroup.findOne({ _id:id })
      if (!exist) throw `This recored deleted!`

      const roleG = Meteor.users.findOne({'profile.roleGroup':id})
      if(roleG) throw `This role has been used`

      return RoleGroup.remove({ _id:id })
    } catch (error: any) {
      throw new Meteor.Error('delete role group error', error)
    }
  },
  removeRoles(){
    return Role.remove()

  },
  getRoles( selector ) {
    return Role.find(selector).fetch()
  },
  getRolesValue() {
    const data = Role.aggregate([
      {
          $group:{
              _id:{group:'$group',title:'$title'},
              list:{
                  $push:{
                      name:'$name'
                  }
              },
              order:{$last:'$order'}
          }
      },
      {
          $group:{
              _id:'$_id.group',
              order:{$last:'$order'},
              details:{
                  $push:{
                      title:'$_id.title',
                      list:'$list'
                  }
              }
          }
      },
      {
          $sort:{order:1}
      }
  ])
  return data
  },
  checkRoleGroupExist({selector}) {
    return RoleGroup.findOne(selector)
  },
  findRoleGroup(){
    const data =RoleGroup.aggregate([
      {
        $project:{
          name:1,
          roles:1,
          status:1,
        }
      }
    ])
    //console.log('Role data',data)
    return data
  }
})