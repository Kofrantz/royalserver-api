import express from 'express'
import http from 'http'
import cors from 'cors'
import 'dotenv/config'
import { Server as socketIO } from 'socket.io'
import router from './routes/router'
import entrySocket from './sockets/entrySocket'

const app = express()
const server = http.createServer(app)
export const io = new socketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
})

// middlewares
const corsConfig = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
app.use(cors(corsConfig))
app.use(express.json())

// routes
app.use('/api', router)

// websockets
entrySocket(io)

export default server
