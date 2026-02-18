"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const getVirtualboxFiles_1 = __importDefault(require("./getVirtualboxFiles"));
const zod_1 = require("zod");
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const node_pty_1 = require("node-pty");
const os_1 = __importDefault(require("os"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    }
});
const terminals = {};
const dirName = path_1.default.join(__dirname, "..");
const handshakeSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    virtualboxId: zod_1.z.string(),
    type: zod_1.z.enum(["node", "react"]),
    EIO: zod_1.z.string(),
    transport: zod_1.z.string()
});
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const q = socket.handshake.query;
    console.log("middleware");
    console.log(q);
    const parseQuery = handshakeSchema.safeParse(q);
    if (!parseQuery.success) {
        next(new Error("Invalid request"));
        return;
    }
    const { virtualboxId, userId, type } = parseQuery.data;
    const dbUser = yield fetch(`https://database.mzli.workers.dev/api/user?id=${q.userId}`);
    const dbUserJSON = yield dbUser.json();
    if (!dbUserJSON) {
        next(new Error("DB error"));
        return;
    }
    const virtualbox = dbUserJSON.virtualbox.find((v) => v.id === virtualboxId);
    if (!virtualbox) {
        next(new Error("Invalid credentials"));
        return;
    }
    socket.data = {
        id: virtualboxId,
        type,
        userId
    };
    next();
}));
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const data = socket.data;
    const virtualboxFiles = yield (0, getVirtualboxFiles_1.default)(data.id);
    virtualboxFiles.fileData.forEach((file) => {
        const filePath = path_1.default.join(dirName, file.id);
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
        fs_1.default.writeFile(filePath, file.data, function (err) {
            if (err)
                throw err;
        });
    });
    socket.emit("loaded", virtualboxFiles.files);
    socket.on("getFile", (fileId, callback) => {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId);
        if (!file)
            return;
        callback(file.data);
    });
    socket.on("saveFile", (fileId, body) => __awaiter(void 0, void 0, void 0, function* () {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId);
        if (!file)
            return;
        file.data = body;
        fs_1.default.writeFile(path_1.default.join(dirName, file.id), body, function (err) {
            if (err)
                throw err;
        });
        yield (0, utils_1.saveFile)(fileId, body);
    }));
    socket.on("createFile", (name) => __awaiter(void 0, void 0, void 0, function* () {
        const id = `projects/${data.id}/${name}`;
        fs_1.default.writeFile(path_1.default.join(dirName, id), "", function (err) {
            if (err)
                throw err;
        });
        virtualboxFiles.files.push({ id, name, type: "file" });
        virtualboxFiles.fileData.push({ id, data: "" });
        yield (0, utils_1.createFile)(id);
    }));
    socket.on("renameFile", (fileId, newName) => __awaiter(void 0, void 0, void 0, function* () {
        const file = virtualboxFiles.fileData.find((f) => f.id === fileId);
        if (!file)
            return;
        file.id = newName;
        const parts = fileId.split("/");
        const newFileId = parts.slice(0, parts.length - 1).join("/") + "/" + newName;
        fs_1.default.rename(path_1.default.join(dirName, fileId), path_1.default.join(dirName, newFileId), function (err) {
            if (err)
                throw err;
        });
        yield (0, utils_1.renameFile)(fileId, newFileId, file.data);
    }));
    socket.on("createTerminal", ({ id }) => {
        const pty = (0, node_pty_1.spawn)(os_1.default.platform() === "win32" ? "cmd.exe" : "bash", [], {
            name: "xterm", cols: 100, cwd: path_1.default.join(dirName, "projects", data.id)
        });
        pty.onData((data) => {
            socket.emit("terminalResponse", {
                data
            });
        });
        pty.onExit((code) => console.log("exit:(", code));
        terminals[id] = pty;
    });
    socket.on("terminalData", ({ id, data }) => {
        if (!terminals[id])
            return;
        try {
            terminals[id].write(data);
        }
        catch (err) {
            console.log("Error writing to terminal", err);
        }
    });
    socket.on("disconnect", () => { });
}));
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
