import axios from 'axios'
import { uuid } from 'uuidv4'
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process'

export interface VersionData {
    id: string
    releaseTime: string
    time: string
    type: string
    url: string
}

export interface VersionPackage {
    id: string
    downloads: {
        server: {
            url: string
        }
    }
    javaVersion: {
        component: string
        majorVersion: number
    }
}

export interface LogData {
    msg: string
    type: LogType
}

export enum LogType {
    MESSAGE = 'MESSAGE',
    ERROR = 'ERROR',
    CLOSE = 'CLOSE',
    SERVER = 'SERVER',
}

export enum ServerStatus {
    CREATED = 'CREATED',
    INITIALIZING = 'INITIALIZING',
    STARTING = 'STARTING',
    RUNNING = 'RUNNING',
    STOPPING = 'STOPPING',
    STOPPED = 'STOPPED',
    FAILED = 'FAILED',
}

class ServerInstance {
    public id: string = uuid()
    public name: string = ''
    private version: VersionData | null = null
    private spawnProcess: ChildProcessWithoutNullStreams | null = null
    private logs: LogData[] = []
    private status: ServerStatus = ServerStatus.CREATED
    private onChangeLogsCb: ((newLog: LogData) => void) | null = null

    constructor(name: string, version: VersionData) {
        this.name = name
        this.version = version
    }

    async initalizeServer() {
        this.setStatus(ServerStatus.INITIALIZING)
        try {
            const response = await axios.get(`${this.version?.url}`)
            const versionPackage: VersionPackage = response.data

            await checkImageOrCreate()
            await createContainer(this.id, versionPackage.downloads.server.url, this.addLog)

            this.setStatus(ServerStatus.CREATED)
        } catch (err) {
            throw err
        }
    }

    async startServer() {
        this.setStatus(ServerStatus.STARTING)
        this.spawnProcess = spawn('docker', [
            'exec',
            '-i',
            `${this.id}-minecraft-server`,
            'java',
            '-Xms1024M',
            '-Xmx2048M',
            '-jar',
            'server.jar',
            'nogui',
        ])
        // capture logs
        this.spawnProcess?.stdout.on('data', (data) => {
            this.addLog({
                type: LogType.MESSAGE,
                msg: data.toString(),
            })
        })

        // capture error
        this.spawnProcess?.stderr.on('data', (data) => {
            this.addLog({
                type: LogType.ERROR,
                msg: data.toString(),
            })
        })

        this.spawnProcess?.on('close', (code) => {
            this.addLog({
                type: LogType.CLOSE,
                msg: `Server exited with code ${code}`,
            })
            this.spawnProcess = null
        })
    }

    // SERVER LOGS
    private addLog(log: LogData) {
        console.log(`LOG: ${log.msg}`)
        this.logs.push(log)
        if (log.type === LogType.ERROR) this.setStatus(ServerStatus.FAILED)

        // if is starting check if has done
        if (this.status === ServerStatus.STARTING && log.msg.includes('Done')) this.setStatus(ServerStatus.RUNNING)

        if (!!this.onChangeLogsCb) this.onChangeLogsCb(log)
    }
    public onChangeLogs(cb: (newLog: LogData) => void) {
        this.onChangeLogsCb = cb
    }

    // SERVER STATUS
    getStatus(): ServerStatus {
        return this.status
    }
    setStatus(s: ServerStatus) {
        this.status = s
    }
}

// const executeCommand = (command: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         exec(command, (error, stdout) => {
//             if (error) reject(`Error: ${error}`)
//             resolve(stdout)
//         })
//     })
// }

const createContainer = async (id: string, downloadURL: string, addLogCb: (log: LogData) => void): Promise<string> => {
    try {
        return await new Promise((resolve, reject) => {
            exec(`docker run -d --name ${id}-minecraft-server minecraft-server`, (error, stdout) => {
                if (error) reject(`Error: ${error}`)
                console.log(stdout)
                console.log('downloading server.jar...')
                const downloadProcess = spawn('docker', ['exec', `${id}-minecraft-server`, 'wget', downloadURL])
                // capture logs
                downloadProcess.stdout.on('data', (data) => {
                    addLogCb({
                        type: LogType.MESSAGE,
                        msg: data.toString(),
                    })
                })

                // capture error
                downloadProcess.stderr.on('data', (data) => {
                    addLogCb({
                        type: LogType.ERROR,
                        msg: data.toString(),
                    })
                })

                downloadProcess.on('close', (code) => {
                    addLogCb({
                        type: LogType.CLOSE,
                        msg: `Server exited with code ${code}`,
                    })
                    resolve('done')
                })
            })
        })
    } catch (err) {
        throw err
    }
}

const checkImageOrCreate = async () => {
    try {
        const img: any[] = await new Promise((resolve, reject) => {
            exec('docker image inspect minecraft-server', (error, stdout) => {
                if (error && !error?.message.includes('No such image')) reject(`Error: ${error}`)
                resolve(JSON.parse(stdout))
            })
        })

        if (img.length === 0) {
            console.log('CREATE NEW IMAGE')
            const res = await new Promise((resolve, reject) => {
                exec('docker build -t minecraft-server ./src/mcServerFiles', (error, stdout) => {
                    if (error) reject(`Error: ${error}`)
                    resolve(stdout)
                })
            })
            console.log(res)
        }
    } catch (err) {
        throw err
    }
}

export default ServerInstance
