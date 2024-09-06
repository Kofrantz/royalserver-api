import ServerInstance, { LogData, VersionData } from './serverInstance'

export class ServersHandler {
    private servers: Record<string, ServerInstance> = {}

    async registerServer(
        name: string,
        version: VersionData,
        onChangeLogsCb: (log: LogData, id: string) => void
    ): Promise<ServerInstance> {
        try {
            const serverInstance = new ServerInstance(name, version)
            await serverInstance.initalizeServer()
            serverInstance.onChangeLogs((log) => onChangeLogsCb(log, serverInstance.id))
            this.servers[serverInstance.id] = serverInstance
            return this.servers[serverInstance.id]
        } catch (err) {
            throw err
        }
    }

    getServerInstanceById(id: string): ServerInstance | undefined {
        return this.servers[id]
    }
}

export const serversHandler: ServersHandler = new ServersHandler()
