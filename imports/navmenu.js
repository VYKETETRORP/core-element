export const sidebarMenu = [
  {
    title: "Members",
    icon: "mdi-file-find",
    route: {
      name: "Member",
    },
    order: 3,
  },
  {
    title: "Admin Setting",
    icon: "mdi-account-cog-outline",
    children: [
      {
        title: "Create Customer",
        icon: "mdi-card-account-details",
        route: {
          name: "Customer",
        },
      },
      {
        title: "Profile",
        icon: "mdi-card-account-details",
        route: {
          name: "Profile",
        },
      },
      {
        title: "Group",
        icon: "mdi-layers",
        route: {
          name: "RoleGroup",
        },
        roles: ["role-group"],
      },
      {
        title: "User",
        icon: "mdi-account",
        route: {
          name: "User",
        },
        roles: ["user"],
      },
    ],
    order: 2,
  },

  //  {
  //    title: "Report",
  //    icon: "mdi-file-find",
  //    route: {
  //      name: "Report",
  //    },
  //    order: 3,
  //  },
];
