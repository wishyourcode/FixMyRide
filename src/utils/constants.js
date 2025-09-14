const UserRolesEnum = {
  ADMIN: "admin",
  USER: "user",
  MECHANIC: "mechanic",
  FUEL_STATION: "fuel_station",
};

const AvailableUserRoles = Object.values(UserRolesEnum);
const TaskStatusEnum = {
  TODO: "to_do",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};
const AvailableTaskStatus = Object.values(taskStatusEnum);

export default {
  UserRolesEnum,
  AvailableUserRoles,
  TaskStatusEnum,
  AvailableTaskStatus,
};
