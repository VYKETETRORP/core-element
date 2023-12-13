import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Role = new Mongo.Collection('app_roles')

Role.schema = new SimpleSchema({
  name: {
    type: String,
    max: 200,
  },
  group: {
    type: String,
  },
  title: String,
  order: Number,
})

Role.attachSchema(Role.schema)

export default Role
