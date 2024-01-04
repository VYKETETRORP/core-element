import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const AuditLogs = new Mongo.Collection('app_auditLogs')

// Schema
AuditLogs.schema = new SimpleSchema({
  page: String,
  event: {
    type: String,
    allowedValues: ['LOG', 'ADD', 'EDIT', 'DELETE'],
  },
  title: String,
  data: {
    type: String,
    optional: true,
  },
  refId: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue() {
      return new Date()
    },
  },
  createdBy: {
    type: String,
    autoValue() {
      if (!this.value)
        return this.userId || ''
    },
  }
})

AuditLogs.attachSchema(AuditLogs.schema)

export default AuditLogs