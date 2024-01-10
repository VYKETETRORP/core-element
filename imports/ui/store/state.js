import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

export default {
  namespaced: true,
  lang: 'en',
  currentUser: Meteor.user() || Session.get('currentUser'),
  currentBranch: Session.get('currentBranch'),
  // allowedBranches: Session.get('allowedBranches') || [],
};
