const users = []

const addUser = ({ id , username , room }) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !id){
        return {
            error: 'Username and Room are Required' 
        }
    }

    const existing = users.find( (user) => {
        return  user.room === room && user.username === username 
    })

    if(existing){
        return {
            error: 'Username is in use!'
        }
    }

    const user = { id , username , room }
    users.push(user)
    return { user }
}


const removeUser = (id) => {
    const index = users.findIndex( (user) => {
        return user.id == id
    })

    if(index !== -1){
        return users.splice(index , 1)[0]
    }
}

const getUser = (id) => {
    return users.find( (user) => {
        return user.id === id
    })
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter( (user) => {
        return user.room === room  
    })
}

module.exports = {
    addUser , 
    removeUser , 
    getUser , 
    getUsersInRoom
}


// addUser({
//     id : 22 , 
//     username : 'mo' , 
//     room : 'efjsdxf'
// })

// addUser({
//     id : 88 , 
//     username : 'mo8' , 
//     room : 'efjsdx8f'
// })

// addUser({
//     id : 884 , 
//     username : 'mo8r' , 
//     room : 'efjsdx8f'
// })

// const user = getUsersInRoom('efjsdx8f')

// //const user = getUser(22)
// // const re = removeUser(22)
// // console.log(re)
// console.log(user)