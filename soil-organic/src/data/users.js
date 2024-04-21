const ALL_USERS = "users";
const CURRENT_USER = "user";

function getUsers() {
  let users = [];
  const localUsers = localStorage.getItem(ALL_USERS);
  if (localUsers) {
    users = JSON.parse(localUsers);
  }
  return users;
}

function findUser(email) {
  return getUsers().find(user => user.email === email);
}

function verifyUser(username, password) {
  const users = getUsers();
  for (let everyUser in users) {
    if (everyUser.name === username && everyUser.password === password) {
      return everyUser;
    }
  }
  return null;
}

function addUser(userObject) {
  let allUsers = getUsers();
  userObject.profile = userObject.profile || {
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    dietaryPreferences: [],
    healthGoals: []
  };
  allUsers.push(userObject);
  localStorage.setItem(ALL_USERS, JSON.stringify(allUsers));
}

function updateUser(updatedUser) {
  let users = getUsers();
  const index = users.findIndex(user => user.email === updatedUser.email);
  if (index !== -1) {
    // Merge the changes instead of replacing the whole user object
    users[index] = { ...users[index], ...updatedUser };
    localStorage.setItem(ALL_USERS, JSON.stringify(users));
    return true; // Indicate the update was successful
  }
  return false; // Indicate the update failed
}

function deleteUser(email) {
  let users = getUsers();
  users = users.filter(user => user.email !== email);
  localStorage.setItem(ALL_USERS, JSON.stringify(users));
  localStorage.removeItem(CURRENT_USER);
}

function setUser(userObject) {
  addUser(userObject);
  localStorage.setItem(CURRENT_USER, userObject.email);
}

function getUser() {
  return localStorage.getItem(CURRENT_USER);
}

function removeUser() {
  localStorage.removeItem(CURRENT_USER);
}

export { setUser, getUser, removeUser, verifyUser, findUser, updateUser, deleteUser };
