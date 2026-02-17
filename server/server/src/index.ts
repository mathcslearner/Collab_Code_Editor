import express, {Express} from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import getVirtualboxFiles from "./getVirtualboxFiles";
import {z} from "zod"
import { renameFile } from "./utils";

const app: Express = express();

const port = process.env.PORT || 4000

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

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

    socket.emit("loaded", virtualboxFiles.files)

    socket.on("getFile", (fileId: string, callback) => {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId)
        if (!file) return

        callback(file.data)
    })

    socket.on("renameFile", async (fileId: string, newName: string) => {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId)

        if (!file) return

        await renameFile(fileId, newName, file.data)

        file.id = newName
    })
})

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
})