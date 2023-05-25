import { io } from 'socket.io-client'
let socket: any;

const createConnection = async() => {
    return io('http://localhost:8080', {
        path: '/io/',
        secure: false,
        withCredentials: true,
    })
}

const getSocketInstance = async() => {
    if (!socket)
        socket = await createConnection()

    return socket
}

const initSocket = async(setOnlineState: any) => {
    const sio = await getSocketInstance()

    sio.on('connect', () => {
        console.log('socket is connected', sio.id)
        setOnlineState(sio.connected)
        sio.emit('Create_Room', 'NewRoom:1')
    })

    sio.on('disconnect', (error: Error) => {
        console.log("Error disconnected", error)
        console.log('socket is disconnected', sio.id)
        setOnlineState(sio.connected)
    })

    return sio
}

export {
    initSocket,
    getSocketInstance,
}