import { Socket, Server as socketIO } from 'socket.io'
import { SocketEvent } from './events'
// import { SocketEvent } from './events'
import { SocketConnection } from './socketConnection'
import { connectToServer, disconnectFromServer } from 'controllers/socketControllers/server'
// import { executeCommand, startServer, stopServer } from '../controllers/serverFunctions'
// import { LogData, processManager } from '../utils/processManager'

const entrySocket = (io: socketIO) => {
    io.on('connection', (socket: Socket) => {
        console.log(socket)
        const sc = new SocketConnection(socket)

        sc.on(SocketEvent.CONNECT_TO_SERVER, (...args) => connectToServer(sc, ...args))
        sc.on(SocketEvent.DISCONNECT_FROM_SERVER, (...args) => disconnectFromServer(sc, ...args))

        // if (processManager != null) {
        //     sc.emit(SocketEvent.LOGS, processManager.getLogs())
        //     processManager.onChangeLogs((log: LogData) => {
        //         sc.emit(SocketEvent.SERVER_LOG, log)
        //     })
        // }
        // sc.on(SocketEvent.START_SERVER, (...args) => startServer(sc, ...args))
        // sc.on(SocketEvent.STOP_SERVER, (...args) => stopServer(sc, ...args))
        // sc.on(SocketEvent.EXECUTE_COMMAND, (...args) => executeCommand(sc, ...args))
    })
}

export default entrySocket
