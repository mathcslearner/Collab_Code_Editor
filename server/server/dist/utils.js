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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = exports.renameFile = void 0;
const renameFile = (fileId, newName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const parts = fileId.split("/");
    const newFileId = parts.slice(0, parts.length - 1).join("/") + "/" + newName;
    const res = yield fetch(`https://storage.mzli.workers.dev/api/rename`, {
        method: "POST",
        headers: {
            "Content-Type": "applications/json"
        },
        body: JSON.stringify({ fileId, newFileId, data })
    });
    return res.ok;
});
exports.renameFile = renameFile;
const saveFile = (fileId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`https://storage.mzli.workers.dev/api/save`, {
        method: "POST",
        headers: {
            "Content-Type": "applications/json"
        },
        body: JSON.stringify({ fileId, data })
    });
    return res.ok;
});
exports.saveFile = saveFile;
