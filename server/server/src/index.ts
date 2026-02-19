import express, {Express} from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import getVirtualboxFiles from "./getVirtualboxFiles";
import {z} from "zod"
import { createFile, deleteFile, renameFile, saveFile } from "./utils";
import { Pty } from "./terminal";
import path from "path";
import fs from "fs"
import {IDisposable, IPty, spawn} from "node-pty"
import os from "os"

const app: Express = express();

const port = process.env.PORT || 4000

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

const terminals: {[id: string]: {terminal: IPty, onData: IDisposable, onExit: IDisposable}} = {}

const dirName = path.join(__dirname, "..")

const handshakeSchema = z.object({
    userId: z.string(),
    virtualboxId: z.string(),
    type: z.enum(["node", "react"]),
    EIO: z.string(),
    transport: z.string()
})

io.use(async (socket, next) => {
    const q = socket.handshake.query;

    console.log("middleware");
    console.log(q);

    const parseQuery = handshakeSchema.safeParse(q);

    if (!parseQuery.success) {
        next(new Error("Invalid request"));
        return;
    }

    const {virtualboxId, userId, type} = parseQuery.data

    const dbUser = await fetch(`https://database.mzli.workers.dev/api/user?id=${q.userId}`);
    const dbUserJSON = await dbUser.json()

    if (!dbUserJSON) {
        next(new Error("DB error"));
        return;
    }

    const virtualbox = dbUserJSON.virtualbox.find((v: any) => v.id === virtualboxId)

    if (!virtualbox) {
        next(new Error("Invalid credentials"))
        return
    }

    socket.data = {
        id: virtualboxId,
        type,
        userId
    }

    next();
})

io.on("connection", async (socket) => {
    const data = socket.data as {
        userId: string
        id: string
        type: "node" | "react"
    }

    const virtualboxFiles = await getVirtualboxFiles(data.id)
    virtualboxFiles.fileData.forEach((file) => {
        const filePath = path.join(dirName, file.id)
        fs.mkdirSync(path.dirname(filePath), {recursive: true})
        fs.writeFile(filePath, file.data, function (err) {
            if (err) throw err
        })
    })

    socket.emit("loaded", virtualboxFiles.files)

    socket.on("getFile", (fileId: string, callback) => {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId)
        if (!file) return

        callback(file.data)
    })

    socket.on("saveFile", async (fileId: string, body: string) => {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId)

        if (!file) return

        file.data = body

        fs.writeFile(path.join(dirName, file.id), body, function (err) {
            if (err) throw err
        })

        await saveFile(fileId, body)
    })

    socket.on("createFile", async (name: string) => {
        const id = `projects/${data.id}/${name}`

        fs.writeFile(path.join(dirName, id), "", function (err) {
            if (err) throw err
        })

        virtualboxFiles.files.push({id, name, type: "file"})
        virtualboxFiles.fileData.push({id, data: ""})

        await createFile(id)
    })

    socket.on("deleteFile", async (fileId: string, callback) => {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId)

        if (!file) return

        fs.unlink(path.join(dirName, fileId), function (err) {
            if (err) throw err
        })

        virtualboxFiles.fileData = virtualboxFiles.fileData.filter((f) => f.id !== fileId)

        await deleteFile(fileId)

        const newFiles = await getVirtualboxFiles(data.id)
        callback(newFiles.files)
    })

    socket.on("renameFile", async (fileId: string, newName: string) => {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId)

        if (!file) return

        file.id = newName
        const parts = fileId.split("/")
        const newFileId = parts.slice(0, parts.length - 1).join("/") + "/" + newName

        fs.rename(path.join(dirName, fileId), path.join(dirName, newFileId), function (err) {
            if (err) throw err
        })

        await renameFile(fileId, newFileId, file.data)
    })

    socket.on("createTerminal", ({id}: {id: string}) => {
        const pty = spawn(os.platform() === "win32" ? "cmd.exe" : "bash", [], {
            name: "xterm", cols: 100, cwd: path.join(dirName, "projects", data.id)
        })

        const onData = pty.onData((data) => {
            socket.emit("terminalResponse", {
                data
            })
        })

        const onExit = pty.onExit((code) => console.log("exit:(", code))
        pty.write("clear\r")
        terminals[id] = {terminal: pty, onData, onExit}
    })

    socket.on("terminalData", ({id, data}: {id: string, data: string}) => {
        if (!terminals[id]) return

        try {
            terminals[id].terminal.write(data)
        } catch (err) {
            console.log("Error writing to terminal", err)
        }
    })

    socket.on("disconnect", () => {
        Object.entries(terminals).forEach((t) => {
            const {terminal, onData, onExit} = t[1]
            if (os.platform() !== "win32") {
                terminal.kill()
            } 

            onData.dispose()
            onExit.dispose()
            delete terminals[t[0]]
        })
    })

})

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
})