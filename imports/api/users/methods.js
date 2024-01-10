import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { CallPromiseMixin } from "meteor/didericis:callpromise-mixin";
import SimpleSchema from "simpl-schema";
import { UserInsertSchema, UserUpdateSchema } from "./users";

// Find
export const findUsers = new ValidatedMethod({
  name: "app.findUsers",
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
    page: {
      type: Number,
    },
    rowsPerPage: {
      type: Number,
    },
  }).validator(),
  run({ selector, options, page, rowsPerPage }) {
    if (Meteor.isServer) {
      selector = selector || {};
      options = options || {};

      const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage;
      const skip = rowsPerPage * (page - 1);

      //   let users = Meteor.users.find(selector, options).fetch();
      let users = Meteor.users.aggregate([
        {
          $match: selector,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);
      // users.forEach((o) => {
      //   o.groupDoc = RoleGroups.findOne({ _id: o.profile.roleGroup })
      // })
      const total = Meteor.users.find(selector).count();
      return { users, total };
    }
  },
});

// Insert
export const insertUser = new ValidatedMethod({
  name: "app.insertUser",
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    user: UserInsertSchema,
  }).validator(),
  run({ user }) {
    if (Meteor.isServer) {
      // Check role
      // userIsInRole(['super', 'admin'])

      // Add new user
      const userId = Accounts.createUser({
        username: user.username,
        email: user.email,
        password: user.password,
        profile: {
          fullName: user.fullName,
          // expiryDay: user.expiryDay,
          // expiryDate: user.expiryDate,
          status: user.status,
          allowedBranches: user.allowedBranches,
          roleGroup: user.roleGroup,
          roles: user.roles,
        },
      });

      return userId;
    }
  },
});

// Find One
export const findOneUser = new ValidatedMethod({
  name: "app.findOneUser",
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: String,
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      return Meteor.users.findOne({ _id });
    }
  },
});

// Update
export const updateUser = new ValidatedMethod({
  name: "app.updateUser",
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    user: UserUpdateSchema,
  }).validator(),
  run({ user }) {
    if (Meteor.isServer) {
      Meteor.users.update(
        { _id: user._id },
        {
          $set: {
            username: user.username,
            "emails.0.address": user.email,
            profile: {
              fullName: user.fullName,
              // expiryDay: user.expiryDay,
              // expiryDate: user.expiryDate,
              status: user.status,
              allowedBranches: user.allowedBranches,
              roleGroup: user.roleGroup,
              roles: user.roles,
            },
          },
        }
      );

      // Update password
      if (user.password) {
        Accounts.setPassword(user._id, user.password);

        if (user._id === Meteor.userId()) {
          return "logout";
        }
      }

      return "success";
    }
  },
});

// Remove
export const removeUser = new ValidatedMethod({
  name: "app.removeUser",
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
      // Check role
      // userIsInRole(['super'])

      return Meteor.users.remove(selector);
    }
  },
});