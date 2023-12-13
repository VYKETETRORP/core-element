import Role from "../../api/roles/roles";
import { Mongo } from "meteor/mongo";
export const initRoles = async () => {
  const roles = [
    //{
    //    name: ' viewUser',
    //    group: 'General',
    //    title: 'SideBar',
    //    order: 4
    //  },

    //admin setting
    {
      name: "Admin Setting",
      group: "Setting",
      title: "Admin Setting",
      order: 5,
    },
    {
      name: "insertUser",
      group: "Setting",
      title: "Admin Setting",
      order: 5,
    },
    {
      name: "updateUser",
      group: "Setting",
      title: "Admin Setting",
      order: 5,
    },
    {
      name: "removeUser",
      group: "Setting",
      title: "Admin Setting",
      order: 5,
    },
    {
      name: "insertGroup",
      group: "Setting",
      title: "Admin Setting",
      order: 5,
    },
    {
      name: "updateGroup",
      group: "Setting",
      title: "Admin Setting",
      order: 5,
    },
    {
      name: "removeGroup",
      group: "Setting",
      title: "Admin Setting",
      order: 5,
    },
    {
      name: "Group",
      group: "Setting",
      title: "Admin Setting",
      order: 5,
    },

    //student setting
    {
      name: "insertStudent",
      group: "Setting",
      title: "Student Setting",
      order: 5,
    },
    {
      name: "updateStudent",
      group: "Setting",
      title: "Student Setting",
      order: 5,
    },

    {
      name: "removeStudent",
      group: "Setting",
      title: "Student Setting",
      order: 5,
    },

    ///end student setting

    //{
    //  name: 'viewBranch',
    //  group: 'General',
    //  title: 'Form',
    //  order: 4
    //},
    {
      name: "viewReportStudent",
      group: "General",
      title: "Report",
      order: 4,
    },
    {
      name: "insertReportTeacher",
      group: "General",
      title: "Report",
      order: 4,
    },
    {
      name: "insertReportGrade",
      group: "General",
      title: "Report",
      order: 4,
    },
    {
      name: " insertStudent",
      group: "General",
      title: "SideBar",
      order: 4,
    },
    {
      name: " insertTeacher",
      group: "General",
      title: "SideBar",
      order: 4,
    },
    {
      name: " updateTeacher",
      group: "General",
      title: "SideBar",
      order: 4,
    },
    {
      name: " removeTeacher",
      group: "General",
      title: "SideBar",
      order: 4,
    },

    //{
    //  name: ' updateUser',
    //  group: 'General',
    //  title: 'SideBar',
    //  order: 4
    //},
    //{
    //  name: ' removeUser',
    //  group: 'General',
    //  title: 'SideBar',
    //  order: 4
    //},
    {
      name: " viewReport",
      group: "General",
      title: "SideBar",
      order: 4,
    },
    //{
    //  name: ' viewUserProfile',
    //  group: 'User',
    //  title: 'SideBar',
    //  order: 4
    //},
    {
      name: "viewDashboard",
      group: "General",
      title: "SideBar",
      order: 4,
    },
  ];

  // Loop check exist role
  for (let i = 0; i < roles.length; i++) {
    const it = roles[i];
    const exist = Role.findOne({ name: it.name });
    if (!exist) {
      const _id = new Mongo.ObjectID().toHexString();
      it._id = _id;
      // insert role group
      Role.insert(it);
    }
  }
};
