import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { CallPromiseMixin } from "meteor/didericis:callpromise-mixin";
import SimpleSchema from "simpl-schema";
import RoleGroups from "../roles/roleGroup";

// Group
export const lookupRole = new ValidatedMethod({
  name: "app.lookupRole",
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
      selector = selector || {};

      let data = RoleGroups.find(selector, { sort: { name: 1 } });
      let list = data.map((o) => {
        return { label: o.name, value: o._id, doc: o };
      });

      return list;
    }
  },
});