import { Socket } from 'socket.io'
import { SocketEvent } from './events'

export class SocketConnection {
    private s: Socket
    constructor(socket: Socket) {
        this.s = socket
        this.s.on('disconnect', () => {
            console.log('User disconnected')
        })
        console.log('User connected')
    }
    emit(event: SocketEvent, message: any) {
        this.s.emit(event, message)
    }
    on(event: SocketEvent, cb: () => void) {
        this.s.on(event, cb)
    }
    join(room: string) {
        this.s.join(room)
    }
    leave(room: string) {
        this.s.leave(room)
    }
}
