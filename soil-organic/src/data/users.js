/**
 * Utility functions for managing users in localStorage. This module provides functions
 * for user authentication, retrieval, and updates, simulating a simple user management
 * system in client-side storage.
 */

import axios from "axios";
const ALL_USERS = "users";  // Key in localStorage for all users data
const CURRENT_USER = "user";  // Key in localStorage for the currently logged-in user

const API_HOST = "http://localhost:4000";
const USER_KEY = "user"


/**
 * Retrieves all users from localStorage.
 * @returns {Array} Array of user objects.
 */
function getUsers() {
  let users = [];
  const localUsers = localStorage.getItem(ALL_USERS);
  if (localUsers) {
    users = JSON.parse(localUsers);
  }
  return users;
}

/**
 * Finds a user by email.
 * @param {string} email - Email of the user to find.
 * @returns {Object|null} The user object if found, otherwise null.
 */
async function findUser(email) {
  //return getUsers().find(user => user.email === email);
  const response = await axios.get(API_HOST + `/api/users/select/${email}`);
  return response.data;
}

/**
 * Verifies user credentials.
 * @param {string} username - User's name.
 * @param {string} password - User's password.
 * @returns {Object|null} The user object if credentials are valid, otherwise null.
 */
function verifyUser(username, password) {
  const users = getUsers();
  for (let everyUser in users) {
    if (everyUser.name === username && everyUser.password === password) {
      return everyUser;
    }
  }
  return null;
}

/**
 * Adds a new user object to the array of stored users.
 * @param {Object} userObject - The user object to add.
 */
async function addUser(userObject) {
  let allUsers = getUsers();
  userObject.profile = userObject.profile || {
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    dietaryPreferences: [],
    healthGoals: []
  };
  // allUsers.push(userObject);
  // localStorage.setItem(ALL_USERS, JSON.stringify(allUsers));
  const response = await axios.post(API_HOST + '/api/users/',userObject);

  return response.data;

}

/**
 * Adds a new user object to the array of stored users.
 * @param {Object} userObject - The user object to add.
 */
async function updateUser(updatedUser) {
  // let users = getUsers();
  // const index = users.findIndex(user => user.email === updatedUser.email);
  // if (index !== -1) {
  //   // Merge the changes instead of replacing the whole user object
  //   users[index] = { ...users[index], ...updatedUser };
  //   localStorage.setItem(ALL_USERS, JSON.stringify(users));
  //   return true; // Indicate the update was successful
  // }
  // return false; // Indicate the update failed
  const response = await axios.put(API_HOST + `/api/users/${updatedUser.email}`,updatedUser)
  return response.data
}

/**
 * Deletes a user from storage.
 * @param {string} email - Email of the user to delete.
 */
async function deleteUser(email) {
  let users = getUsers();
  users = users.filter(user => user.email !== email);
  localStorage.setItem(ALL_USERS, JSON.stringify(users));
  const response = await axios.delete(API_HOST + `/api/users/delete/${email}`)
  console.log(response.data)
  localStorage.removeItem(CURRENT_USER);
  return response.data
}

/**
 * Sets the current user in localStorage.
 * @param {Object} userObject - The user object to set as currently logged in.
 */
async function setUser(userObject) {
  let res = await addUser(userObject);
  console.log("setUser function is being called, respone is" , res.email)
  localStorage.setItem(CURRENT_USER, res.email);
}

/**
 * Retrieves the current user from localStorage.
 * @returns {string|null} The email of the currently logged-in user, if any.
 */
function getUser() {
  return localStorage.getItem(CURRENT_USER);
}

/**
 * Removes the current user from localStorage, effectively logging them out.
 */
function removeUser() {
  localStorage.removeItem(CURRENT_USER);
}

export { setUser, getUser, removeUser, verifyUser, findUser, updateUser, deleteUser };
