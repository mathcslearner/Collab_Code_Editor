"use server"

import { revalidatePath } from "next/cache";

export const createVirtualbox = async (body: {type: string; name:string; visibility: string}) => {
    const res = await fetch("https://database.mzli.workers.dev/api/virtualbox", {
        method: "POST",
        headers: {
            "Content-Type": "application.json"
        },
        body: JSON.stringify(body)
    })

    return await res.text()
}

export const deleteVirtualbox = async (id: string) => {
    const res = await fetch(`https://database.mzli.workers.dev/api/virtualbox/id=${id}`, {
        method: "DELETE",
        
    })

    revalidatePath("/dashboard")
}

export const updateVirtualbox = async (body: {id: string, name?: string, visibility?: "public" | "private"}) => {
    const res = await fetch("https://database.mzli.workers.dev/api/virtualbox", {
        method: "PUT",
        headers: {
            "Content-Type": "application.json"
        },
        body: JSON.stringify(body)
    })

    revalidatePath("/dashboard")
}

export const shareVirtualbox = async (virtualboxId: string, email:string) => {
    try {
        const res = await fetch("https://database.mzli.workers.dev/api/virtualbox/share", {
            method: "POST",
            headers: {
                "Content-Type": "application.json"
            },
            body: JSON.stringify({virtualboxId, email})
        })

        const text = await res.text()

        if (res.status !== 200) {
            return {success: false, message: text}
        }

        revalidatePath(`/code/${virtualboxId}`)
        return {success: true, message: "Shared successfully"}
    } catch (err) {
        return {success: false, message: err}
    }
}

export const unshareVirtualbox = async (virtualboxId: string, userId: string) => {
    const res = await fetch("https://database.mzli.workers.dev/api/virtualbox/share", {
        method: "DELETE",
        headers: {
            "Content-Type": "application.json"
        },
        body: JSON.stringify({virtualboxId, userId})
    })

    revalidatePath(`/code/${virtualboxId}`)
}

export const generateCode = async (code: string, line: number) => {
    const res = await fetch("https://api.cloudflare.com/client/v4/accounts/b5c0804fd695d94ced044d2fb5aaf698/ai/run/@cf/meta/llama-3-8b-instruct", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            "Content-Type": "applications/json"
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    content: "You are an expert coding assistant who reads from an existing code file, and suggests code to add to the file"
                },
                {
                    role: "user",
                    content: ""
                }
            ]
        })
    })
}