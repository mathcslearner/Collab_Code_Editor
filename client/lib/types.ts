export type User = {
    id: string
    name: string 
    email: string
    virtualbox: VirtualBox[]
}

export type VirtualBox = {
    id: string 
    name: string 
    type: "react" | "node"
    bucket: string | null 
    userId: string
}