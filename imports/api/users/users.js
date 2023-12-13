import SimpleSchema from "simpl-schema";

export const UserInsertSchema = new SimpleSchema({
  fullName: {
    type: String,
  },
  username: {
    type: String,
    min: 5,
    max: 20,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    min: 6,
  },
  status: {
    type: String,
  },
  // Alert before 7 days
  // expiryDay: {
  //   type: SimpleSchema.Integer,
  //   optional: true,
  // },
  // expiryDate: {
  //   type: Date,
  //   optional: true,
  // },

  //  allowedBranches: {
  //    type: Array,
  //  },
  //  'allowedBranches.$': {
  //    type: String,
  //  },

  roleGroup: {
    type: String,
  },
  roles: {
    type: Array,
  },
  "roles.$": {
    type: String,
  },
});

export const UserUpdateSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
    min: 5,
    max: 20,
  },
  password: {
    type: String,
    min: 6,
    optional: true,
  },
  email: {
    type: String,
  },
  status: {
    type: String,
  },
  // // Alert before 7 days
  // expiryDay: {
  //   type: SimpleSchema.Integer,
  //   optional: true,
  // },
  // expiryDate: {
  //   type: Date,
  //   optional: true,
  // },

  //  allowedBranches: {
  //    type: Array,
  //  },
  //  'allowedBranches.$': {
  //    type: String,
  //  },

  roleGroup: {
    type: String,
  },
  roles: {
    type: Array,
  },
  "roles.$": {
    type: String,
  },
});
