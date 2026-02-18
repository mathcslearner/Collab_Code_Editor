

export const renameFile = async (fileId: string, newFileId: string, data: string) => {

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

export const createFile = async (fileId: string) => {
    const res = await fetch(`https://storage.mzli.workers.dev/api`, {
        method: "POST",
        headers: {
            "Content-Type": "applications/json"
        },
        body: JSON.stringify({fileId})
    })

    return res.ok
}