import { processManager } from '../utils/processManager'
import { SocketEvent } from '../sockets/events'
import { SocketConnection } from '../sockets/socketConnection'

// export const startServer = async (sc: SocketConnection) => {
//     console.log('EXECUTE START SERVER\n')

//     const server = newProcessManager()
//     server.onChangeLogs((log: LogData) => {
//         sc.emit(SocketEvent.SERVER_LOG, log)
//     })
//     try {
//         server.setStatus(ServerStatus.RUNNING)
//         await server.startProcess('docker', [
//             'exec',
//             '-i',
//             'minecraft-server',
//             'java',
//             '-Xms1024M',
//             '-Xmx2048M',
//             '-jar',
//             'server.jar',
//             'nogui',
//         ])
//         sc.emit(SocketEvent.SERVER_STARTED, '')
//     } catch (err) {
//         console.error(err)
//         server.setStatus(ServerStatus.FAILED)
//     }
// }

// export const stopServer = async (sc: SocketConnection) => {
//     console.log('EXECUTE STOP SERVER\n')

//     try {
//         if (processManager) {
//             processManager.setStatus(ServerStatus.STOPPING)
//             await processManager.executeOnProcess('stop\n')
//             processManager.stopProcess()
//             processManager.setStatus(ServerStatus.STOPPED)
//         }
//         sc.emit(SocketEvent.SERVER_STOPPED, '')
//     } catch (err) {
//         console.error(err)
//         processManager.setStatus(ServerStatus.FAILED)
//     }
// }

export const executeCommand = async (sc: SocketConnection, command?: string) => {
    console.log('EXECUTE COMMAND\n')
    await processManager?.executeOnProcess(`${command}\n`)
    sc.emit(SocketEvent.COMMAND_EXECUTED, '')
}
