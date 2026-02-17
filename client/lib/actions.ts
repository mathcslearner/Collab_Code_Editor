"use server"

const createVirtualbox = async (body: {type: string; name:string; visibility: string}) => {
    const res = await fetch("https://database.mzli.workers.dev/api/virtualbox/create", {
        method: "POST",
        headers: {
            "Content-Type": "application.json"
        },
        body: JSON.stringify(body)
    })
}

export default createVirtualbox