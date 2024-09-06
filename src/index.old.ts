import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
})

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    })
)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

let minecraftProcess: ChildProcessWithoutNullStreams | null
const logs: string[] = []

io.on('connection', (socket) => {
    console.log('A user connected')

    // Check if Minecraft is already running
    // const checkMinecraftRunning = spawn('docker', ['ps', '--filter', 'name=minecraft-server', '--format', '{{.ID}}'])

    // checkMinecraftRunning.stdout.on('data', (data) => {
    //     if (data.toString().trim() && minecraftProcess) {
    //         console.log('Minecraft server is already running. Connecting to existing instance.')
    //         attachToMinecraftProcess(minecraftProcess)
    //     } else {
    //         console.log('Minecraft server is not running. Ready to start a new instance.')
    //     }
    // })

    // Unirse a una room
    // socket.on('joinRoom', (roomName) => {
    //     socket.join(roomName)
    //     console.log(`${socket.id} se unió a la room ${roomName}`)
    // })

    // Salir de una room
    // socket.on('leaveRoom', (roomName) => {
    //     socket.leave(roomName)
    //     console.log(`${socket.id} salió de la room ${roomName}`)
    // })

    socket.emit('logs', logs)
    console.log('Giving connexion data\n')

    // Listener para iniciar el servidor de Minecraft
    socket.on('start-server', () => {
        console.log('EXECUTE START SERVER\n')
        minecraftProcess = spawn('docker', [
            'exec',
            '-i',
            'minecraft-server',
            'java',
            '-Xms1024M',
            '-Xmx2048M',
            '-jar',
            'server.jar',
            'nogui',
        ])
        attachToMinecraftProcess(minecraftProcess)
    })

    // Listener para comandos enviados desde el cliente
    socket.on('execute-command', (command) => {
        console.log('EXECUTE: ', command + '\n')
        if (minecraftProcess?.stdin) {
            minecraftProcess.stdin.write(command + '\n')
        }
        if (minecraftProcess) attachToMinecraftProcess(minecraftProcess)
    })

    // Listener para detener el servidor de Minecraft
    socket.on('stop-server', () => {
        console.log('EXECUTE STOP SERVER\n')
        minecraftProcess?.stdin.write('stop\n')
        if (minecraftProcess) attachToMinecraftProcess(minecraftProcess)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })

    const attachToMinecraftProcess = (mp: ChildProcessWithoutNullStreams) => {
        mp?.stdout.on('data', (data) => {
            logs.push(data.toString())
            socket.emit('server-log', data.toString())
        })

        mp?.stderr.on('data', (data) => {
            logs.push(data.toString())
            socket.emit('server-error', data.toString())
        })

        // mp?.on('close', (code) => {
        //     socket.emit('server-exit', `Server exited with code ${code}`)
        //     minecraftProcess = null // Resetea la referencia cuando el server se detiene
        //     logs = []
        // })
    }

    if (!!minecraftProcess) {
        attachToMinecraftProcess(minecraftProcess)
    }
})

server.listen(3001, () => {
    console.log('listening on *:3001')
})
