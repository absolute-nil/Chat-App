const socket = io()   

//elements
const $messageForm=document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $locationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")


//templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationTemplate,{
        url
    })
    $messages.insertAdjacentHTML('beforeend',html)
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value
    socket.emit('sendmessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
           return console.log(error)
        }
        console.log("message was delivered")
    })
})

$locationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert("Geolocation not supported by your browser")
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{  
        const {coords} = position
        const {latitude,longitude} = coords
        socket.emit('location',longitude,latitude,(error)=>{
            if(error){
                return console.log(error)
            }
            console.log("location shared")
            $locationButton.removeAttribute('disabled')
        })
    })
})