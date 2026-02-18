

export const renameFile = async (fileId: string, newName: string, data: string) => {
    const parts = fileId.split("/")
    const newFileId = parts.slice(0, parts.length - 1).join("/") + "/" + newName

    const res = await fetch(`https://storage.mzli.workers.dev/api/rename`, {
        method: "POST",
        headers: {
            "Content-Type": "applications/json"
        },
        body: JSON.stringify({fileId, newFileId, data})
    })

    return res.ok
}

export const saveFile = async (fileId: string, data: string) => {
    const res = await fetch(`https://storage.mzli.workers.dev/api/save`, {
        method: "POST",
        headers: {
            "Content-Type": "applications/json"
        },
        body: JSON.stringify({fileId, data})
    })

    return res.ok
}