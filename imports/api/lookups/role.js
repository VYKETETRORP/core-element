import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'

import rateLimit from '/imports/api/lib/rate-limit'

import Roles from '../roles/roles'
import RoleGroups from '../roles/RoleGroup'
import ModuleRoles from '../modules/modules-roles'

// Roles
export const lookupRole = new ValidatedMethod({
  name: 'app.lookupRole',
  mixins: [CallPromiseMixin],
  // validate: null,
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  async run({ selector }) {
    if (Meteor.isServer) {
      // Meteor._sleepForMs(100)
      selector = selector || {}
      // let role = ['super', 'owner', 'admin', 'admin-setting', 'account-setting']

      // if (!isOwner()) role.push('admin')
      // if (isAdmin()) role.push(...['admin-setting', 'account-setting'])

      let roles = ['exchange', 'location', 'closing-report']
      const currentUser = Meteor.users.findOne({ _id: Meteor.userId() })
      if (currentUser.username == 'super') {
        roles = []
      }
      let roleSelector = {}
      if (roles.length) {
        roleSelector = {
          name: { $nin: roles },
        }
      }
      let roleIds = []
      let moduleRoles = await ModuleRoles.findOne().lean()

      // Get role ids
      if (moduleRoles) {
        let { moduleRoles: modeRoles = [] } = moduleRoles
        let allRoles = Roles.find(roleSelector).fetch()
        for (let it of allRoles) {
          if (it.moduleRole) {
            if (modeRoles.includes(it.moduleRole)) roleIds.push(it._id)
          } else {
            roleIds.push(it._id)
          }
        }
      }

      // Filter with role ids
      selector._id = { $in: roleIds }

      // Fetch roles
      const roleData = Roles.aggregate([
        {
          $match: selector,
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            tmp: { $push: '$$ROOT' },
            data: { $push: '$$ROOT' },
          },
        },
        {
          $unwind: '$data',
        },
        {
          $sort: { 'data.name': 1 },
        },
        {
          $group: {
            _id: { title: '$data.title', module: '$data.module' },
            count: { $last: '$count' },
            tmp: { $last: '$tmp' },
            module: { $last: '$data.module' },
            index: { $last: '$data.index' },
            title: {
              $push: {
                value: '$data._id',
                label: '$data.name',
              },
            },
          },
        },
        {
          $sort: { index: 1, '_id.title': 1 },
        },
        {
          $group: {
            _id: '$module',
            index: { $last: '$index' },
            count: { $last: '$count' },
            tmp: { $last: '$tmp' },
            module: {
              $push: {
                module: '$_id.title',
                title: '$title',
              },
            },
          },
        },
        {
          $sort: { index: 1 },
        },
        {
          $group: {
            _id: null,
            tmp: { $last: '$tmp' },
            count: { $last: '$count' },
            data: { $push: '$$ROOT' },
          },
        },
      ])[0]

      // Return null if no data found
      if (!roleData) return null

      // Filter data with existed _id
      roleData.data.filter((doc) => {
        return !!doc._id
      })

      console.log('Role Data', roleData);


      return roleData
    }
  },
})

// Group
export const lookupRoleGroup = new ValidatedMethod({
  name: 'app.lookupRoleGroup',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}

      let data = RoleGroups.find(selector, { sort: { name: 1 } })
      let list = data.map((o) => {
        return { label: o.name, value: o._id, doc: o }
      })

      return list
    }
  },
})

rateLimit({
  methods: [],
})

export { lookupRole, lookupRoleGroup };
