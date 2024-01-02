import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'

import rateLimit from '/imports/api/lib/rate-limit'

// Use exist
export const validateUserExist = new ValidatedMethod({
  name: 'app.validateUserExist',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ selector }) {
    if (Meteor.isServer) {
      return Meteor.users.findOne(selector)
    }
  },
})

// User password
export const validateUserPassword = new ValidatedMethod({
  name: 'app.validateUserPassword',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    password: String,
  }).validator(),
  run({ password }) {
    if (Meteor.isServer) {
      let user = Meteor.user()
      let digest = Package.sha.SHA256(password)
      let passwordOpts = { digest: digest, algorithm: 'sha-256' }
      let result = Accounts._checkPassword(user, passwordOpts)

      return result
    }
  },
})

rateLimit({
  methods: [],
})