import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

export default {
  lang: 'en',
  allowedModules: [],
  company: Session.get('company'),
  currentUser: Meteor.user() || Session.get('currentUser'),
  allowedBranches: Session.get('allowedBranches') || [],
  currentBranch: Session.get('currentBranch'),
  exchange: {
    base: 'USD',
    usd: 1,
    khr: 4000,
    thb: 30,
  },
  numericMask: {
    alias: 'numeric',
    radixPoint: '.',
    groupSeparator: ',',
    autoGroup: true,
    digits: 2,
    prefix: '',
    autoUnmask: true,
    inputType: 'number',
  },
}
