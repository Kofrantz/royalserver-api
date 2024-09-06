import { ChildProcessWithoutNullStreams } from 'child_process'

class ProcessManager {
    private spawnProcess: ChildProcessWithoutNullStreams | null = null

    getProcess() {
        return this.spawnProcess
    }

    stopProcess() {
        if (this.spawnProcess) {
            this.spawnProcess.kill()
            this.spawnProcess = null
        }
    }

    async executeOnProcess(command: string) {
        if (this.spawnProcess?.stdin) {
            const err = await new Promise((res, rej): void => {
                this.spawnProcess?.stdin.write(command + '\n', (error) => {
                    if (error) {
                        rej(error)
                    } else {
                        res(false)
                    }
                })
            })
            if (err) {
                console.error(err)
            }
        }
    }
}

// Exportar una instancia de ProcessManager para ser usada en otros archivos
export let processManager = new ProcessManager()

export const newProcessManager = (): ProcessManager => {
    processManager = new ProcessManager()
    return processManager
}

export default ProcessManager
