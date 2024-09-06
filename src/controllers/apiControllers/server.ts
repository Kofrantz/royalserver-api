import { io } from 'app'
import { Request, Response } from 'express'
import { SocketEvent } from 'sockets/events'
import { internalServerError, statusOk } from 'utils/httpResponses'
import { serversHandler } from 'utils/serversManager'

export const createServer = async (req: Request, res: Response) => {
    const { name, version } = req.body
    try {
        const server = await serversHandler.registerServer(name, version, (log, id) => {
            io.to(id).emit(SocketEvent.SERVER_LOG, log)
        })
        statusOk(res, server.id)
    } catch (err) {
        internalServerError(res, 'Error creating server: ', err)
    }
}
