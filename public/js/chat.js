const socket = io()
const form = document.querySelector('#enter')
const formInput = form.querySelector('input')
const formButton = form.querySelector('button')
const locationButton = document.querySelector('#location')
const messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const Template = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoscroll = () => {
    const newMessage = messages.lastElementChild

    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = messages.offsetHeight

    const containerHeight = messages.scrollHeight

    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }
}

socket.on('message' , (message) => {
    console.log(message)
    const htmlText = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', htmlText)
    autoscroll()
})

socket.on('locationMessage' , (message) => {
    console.log(message)
    const html = Mustache.render(Template, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData' , ({ room , users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room ,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

form.addEventListener('submit', (err) => {
    err.preventDefault()

    formButton.setAttribute('disabled', 'disabled')

    const message = err.target.elements.message.value
    
    socket.emit('sendMessage', message, (error) => {

        formButton.removeAttribute('disabled')
        formInput.value = ''
        formInput.focus()
        if(error){
            return console.log(error)
        }

        console.log('delivered')
    })
})

locationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('your browser does not support it')
    }
    locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition( (location) => {
        socket.emit('sendLocation', {
            latitude: location.coords.latitude , 
            longitude: location.coords.longitude 
        }, () => {
            locationButton.removeAttribute('disabled')

            console.log('Location Shared')
        })
    })
})

socket.emit('join', { username , room } , (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }

})