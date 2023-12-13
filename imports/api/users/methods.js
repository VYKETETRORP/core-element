import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

// import rateLimit from '/imports/api/lib/rate-limit'
// import RoleGroups from '../roles/RoleGroups'
import { UserInsertSchema, UserUpdateSchema } from "./users";

// Find
export const findUsers = new ValidatedMethod({
  name: "app.findUsers",
  mixins: [],
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
      selector = selector || {};
      options = options || {};

      const users = Meteor.users.aggregate([
        { $match: selector },

        {
          $lookup: {
            from: "app_roleGroups",
            localField: "profile.roleGroup",
            foreignField: "_id",
            as: "groupDoc",
          },
        },
        { $unwind: { path: "$groupDoc", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            username: { $last: "$username" },
            emails: { $last: "$emails" },
            profile: { $last: "$profile" },

            roleGroup: { $last: "$groupDoc.name" },
          },
        },
      ]);
      console.log("users", users);
      return users;
    }
  },
});

// Find One
export const findOneUser = new ValidatedMethod({
  name: "app.findOneUser",
  mixins: [],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  run({ selector = {} }) {
    if (Meteor.isServer) {
      return Meteor.users.findOne(selector);
    }
  },
});

// Insert
export const insertUser = new ValidatedMethod({
  name: "app.insertUser",
  mixins: [],
  validate: new SimpleSchema({
    user: UserInsertSchema,
  }).validator(),
  run({ user }) {
    if (Meteor.isServer) {
      // Check role
      //  userIsInRole(['super', 'admin'])

      // Add new user
      const userId = Accounts.createUser({
        username: user.username,
        email: user.email,
        password: user.password,
        profile: {
          fullName: user.fullName,
          status: user.status,
          //  allowedBranches: user.allowedBranches,
          roleGroup: user.roleGroup,
          roles: user.roles,
        },
      });

      return userId;
    }
  },
});

// Update
export const updateUser = new ValidatedMethod({
  name: "app.updateUser",
  mixins: [],
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
              status: user.status,
              //  allowedBranches: user.allowedBranches,
              roleGroup: user.roleGroup,
              roles: user.roles,
            },
          },
        }
      );

      if (user.password) {
        Accounts.setPassword(user._id, user.password);
      }

      return "success";
    }
  },
});

// Remove
export const removeUser = new ValidatedMethod({
  name: "app.removeUser",
  mixins: [],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      // Check role
      //   userIsInRole(['super'])

      return Meteor.users.remove({ _id });
    }
  },
});

export const validateUserPassword = new ValidatedMethod({
  name: "app.validateUserPassword",
  mixins: [],
  validate: new SimpleSchema({
    password: String,
  }).validator(),
  run({ password }) {
    if (Meteor.isServer) {
      let user = Meteor.user();
      let digest = Package.sha.SHA256(password);
      let passwordOpts = { digest: digest, algorithm: "sha-256" };
      let result = Accounts._checkPassword(user, passwordOpts);
      return result;
    }
  },
});

// rateLimit({
//   methods: [insertUser, updateUser, removeUser],
// })
