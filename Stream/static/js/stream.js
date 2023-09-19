const APP_ID=""
const TOKEN = sessionStorage.getItem('token')
const CHANNEL = sessionStorage.getItem('room')
let UID = sessionStorage.getItem('UID')


const client= AgoraRTC.createClient({mode:"rtc",codec:"vp8"})
let localTracks=[]
let remoteUsers={}


let joinAndDisplayLocalStreams= async ()=>{
    document.getElementById('room-name').innerText = CHANNEL


    client.on('user-published',handleUserJoined)
     client.on('user-left', handleUserLeft)


// try{
    await client.join(APP_ID,CHANNEL,TOKEN,UID)
// }
// catch(error){
//     console.error(error)
//     window.open('/','_self')

// }
  
  localTracks= await AgoraRTC.createMicrophoneAndCameraTracks()

  let player=`<div class="video-container" id="user-container-${UID}">
            <div class="username-wrapper"> <span class="user-name">Name</span> </div>
            <div class="video-player" id="user-${UID}">
            </div>
            </div>`

    document.getElementById("video-streams").insertAdjacentHTML("beforeend",player)
    localTracks[1].play(`user-${UID}`) 
    await client.publish(localTracks[0],localTracks[1])
}

let handleUserJoined= async (user,mediaType)=>{
    remoteUsers[user.uid]=user;
    await  client.subscribe(user,mediaType)
    if (mediaType ==="video"){
        let player=document.getElementById(`user-container-${user.uid}`)
        if (player !=null){
            player.remove()
        }
     player=player = `<div class="video-container" id="user-container-${user.uid}">
     <div class="username-wrapper"> <span class="user-name">Name</span> </div>
     <div class="video-player" id="video-player-${user.uid}">
     </div>
 </div>`
        console.log('player')
document.getElementById('video-streams').insertAdjacentHTML("beforeend",player)
user.videoTrack.play(`user-${user.uid}`)
    }
    if (mediaType==="audio"){
        user.audioTrack.play()
    }
}


let handleUserLeft=async(user) =>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove
}

let leaveAndRemoveLocalStream =async() =>{
    for(let i=0; localTracks>i;i++){
        localTracks[i].stop()
        localTracks[i].close()
    }
    await client.leave()
    window.open('/','_self')
}

let toggleCamera = async(e) =>{
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor='#fff'
    } else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor='rgb(255,80,80,1)'
    }

}
let toggleMike = async(e) =>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor='#fff'
    } else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor='rgb(255,80,80,1)'
    }

}


joinAndDisplayLocalStreams()


document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',toggleMike)
