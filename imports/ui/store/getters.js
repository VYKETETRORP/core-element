export default {
  fullName(state) {
    return state.currentUser &&
      state.currentUser.profile &&
      state.currentUser.profile.fullName
      ? state.currentUser.profile.fullName
      : "Unknown";
  },
  currentUser (state) {
    return state.currentUser && state.currentUser;
  }
};
