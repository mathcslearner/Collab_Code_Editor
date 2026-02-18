import {Socket} from "socket.io"
import {IPty, spawn} from "node-pty"
import os from "os"

export class Pty {
    socket: Socket
    ptyProcess: IPty
    shell: string

    constructor(socket: Socket, id: string) {
        this.socket = socket 
        this.shell = os.platform() === "win32" ? "cmd.exe" : "bash"
        this.ptyProcess = spawn(this.shell, [], {
            name: "xterm",
            cols: 100,
            cwd: "/temp"
        })

        this.ptyProcess.onData((data) => {
            this.send(data)
        })
    }

    write(data: string) {
        this.ptyProcess.write(data)
    }

    send(data: string) {
        this.socket.emit("terminalResponse", {
            data: Buffer.from(data, "utf-8")
        })
    }

}