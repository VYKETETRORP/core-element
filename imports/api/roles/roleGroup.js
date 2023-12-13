import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Role = new Mongo.Collection('app_roleGroups')

Role.schema = new SimpleSchema({
  name: {
    type: String,
    max: 200,
  },
  status: {
    type: String,
  },
  roles: {
    type: Array,
  },
  'roles.$': String,
})

Role.attachSchema(Role.schema)

export default Role
