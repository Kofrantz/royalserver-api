import { SocketEvent } from 'sockets/events'
import { SocketConnection } from 'sockets/socketConnection'

export const connectToServer = (sc: SocketConnection, ...args: any[]) => {
    const id = args[0]
    sc.join(id)
    sc.emit(SocketEvent.CONNECTED, '')
}

export const disconnectFromServer = (sc: SocketConnection, ...args: any[]) => {
    const id = args[0]
    sc.leave(id)
    sc.emit(SocketEvent.DISCONNECTED, '')
}
