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