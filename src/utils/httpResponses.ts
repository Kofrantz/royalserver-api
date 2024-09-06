import { Response } from 'express'

export const statusOk = (res: Response, msg: string = 'ok') => {
    res.status(200).send({
        message: msg,
    })
}

export const statusAccepted = (res: Response, msg: string = 'accepted') => {
    res.status(202).send({
        message: msg,
    })
}

export const sendJSON = (res: Response, json: any, status: number = 200) => {
    res.status(status).send(json)
}

export const internalServerError = (res: Response, msg: string, err?: Error | unknown) => {
    res.status(500).send({
        msg: msg,
        error: err,
    })
}

export const badRequestError = (res: Response, msg: string, err?: Error | unknown) => {
    res.status(400).send({
        msg: msg,
        error: err,
    })
}

export const notFoundError = (res: Response, msg: string, err?: Error | unknown) => {
    res.status(404).send({
        msg: msg,
        error: err,
    })
}

export const methodNotAllowedError = (res: Response, msg: string, err?: Error | unknown) => {
    res.status(405).send({
        msg: msg,
        error: err,
    })
}
