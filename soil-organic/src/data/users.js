const ALL_USERS = 'users';
const CURRENT_USER='user';



function getUsers(){
    let users = [];
    const localUsers = localStorage.getItem(ALL_USERS);
    if(localUsers){
        users = JSON.parse(localUsers)
    }
    return users;
}

function findUser(email) {
    const allUsers = getUsers();
    console.log(allUsers);
    console.log(email);
    for( let i = 0;i<allUsers.length;i++){
        console.log(allUsers[i].email)
        if(allUsers[i].email==email){
            return allUsers[i];
        }
    }
    
    return null;
}

function verifyUser(username,password){
    const  users = getUsers();
    for(let everyUser in users){
        if(everyUser.name===username && everyUser.password=== password){
            return everyUser
        }
    }
    return null;
}

function addUser(userObject){
   let allUsers =  getUsers();
//    if(allUsers.length===0){
//     localStorage.setItem(ALL_USERS,JSON.stringify(userObject));
//    }
   //else{
    allUsers.push(userObject);
    localStorage.setItem(ALL_USERS,JSON.stringify(allUsers));
   //}
//    allUsers = allUsers+","+JSON.stringify(userObject);
//    localStorage.setItem(ALL_USERS,allUsers);
}

function setUser(userObject) {
    addUser(userObject);
    localStorage.setItem(CURRENT_USER,userObject.email);
}
 
function getUser(){
    return localStorage.getItem(CURRENT_USER);
}

function removeUser(){
    localStorage.removeItem(CURRENT_USER);
}

export{
    setUser,
    getUser,
    removeUser,
    verifyUser,
    findUser
}