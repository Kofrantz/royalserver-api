import { Request, Response } from 'express'
import axios from 'axios'
import { notFoundError, sendJSON } from '../../utils/httpResponses'

export const getVersions = async (req: Request, res: Response) => {
    const versionsURL = process.env.MINECRAFT_VERSIONS_URL

    if (versionsURL === '') return notFoundError(res, 'versions url not found')

    const response = await axios.get(`${versionsURL}`)

    return sendJSON(res, response.data)
}
