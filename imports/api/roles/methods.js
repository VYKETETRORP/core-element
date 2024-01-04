
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'
import RoleGroups from './roleGroup'
import _ from 'lodash'

// Insert
export const insertRoleGroup = new ValidatedMethod({
    name: 'app.insertRoleGroup',
    mixins: [CallPromiseMixin],
    validate: RoleGroups.schema.validator(),
    run(doc) {
      if (Meteor.isServer) {
        try {
          return RoleGroups.insert(doc)
        } catch (error) {
          throwError('Role Group Insert', error, doc)
        }
      }
    },
  })

  

  // Find
export const findRoleGroups = new ValidatedMethod({
  name: 'app.findRoleGroup',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
    options: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      const roleGroups = RoleGroups.find(selector, options).fetch()
      return roleGroups
    }
  },
})
// Check group is used
export const checkRoleGroupIsUsed = new ValidatedMethod({
  name: 'app.checkRoleGroupIsUsed',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
    options: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      return Meteor.users.findOne(selector, options)
    }
  },
})

  

// Find One
export const findOneRoleGroup = new ValidatedMethod({
  name: 'app.findOneRoleGroup',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
    options: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      return RoleGroups.findOne(selector, options)
    }
  },
})


// Update
export const updateRoleGroup = new ValidatedMethod({
  name: 'app.updateRoleGroup',
  mixins: [CallPromiseMixin],
  validate: _.clone(RoleGroups.schema)
    .extend({
      _id: String,
    })
    .validator(),
  run(doc) {
    if (Meteor.isServer) {
      const groupId = doc._id // Bc after update, it will delete doc._id
      const result = RoleGroups.update({ _id: doc._id }, { $set: doc })

      // Update user by roleGroup
      if (result) {
        Meteor.users.update(
          { 'profile.roleGroup': groupId },
          {
            $set: {
              'profile.roles': doc.roles,
            },
          },
          { multi: true }
        )
      }

      return result
    }
  },
})


// Remove
export const removeRoleGroup = new ValidatedMethod({
  name: 'app.removeRoleGroup',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run(selector) {
    if (Meteor.isServer) {
      return RoleGroups.remove(selector)
    }
  },
})