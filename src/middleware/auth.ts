import { NextFunction, Request, Response } from 'express'

export const auth = (req: Request, res: Response, next: NextFunction) => {
    // Lógica de autenticación
    next()
}