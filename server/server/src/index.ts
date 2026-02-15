import express, {Express} from "express";
import { createServer } from "http";
import { Server } from "socket.io";


const app: Express = express();

const port = process.env.PORT || 4000

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

io.use(async (socket, next) => {
    const q = socket.handshake.query;

    console.log("middleware");
    console.log(q);

    if (!q.userId || !q.virtualboxId) {
        next(new Error("Invalid request"));
    }

    const dbUser = await fetch(`https://database.mzli.workers.dev/api/user?id=${q.userId}`);
    const dbUserJSON = await dbUser.json()

    if (!dbUserJSON || !dbUserJSON.virtualbox.includes(q.virtualboxId)) {
        next(new Error("Invalid credentials"))
    }

    next();
})

io.on("connection", async (socket) => {
    console.log("connection")

    const userId = socket.handshake.query.userId

    console.log(userId)
})

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
})