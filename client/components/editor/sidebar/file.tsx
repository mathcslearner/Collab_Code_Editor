"use client"

import { TFile, TTab } from "./types"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { getIconForFile } from "vscode-icons-js"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Loader2, Pencil, Trash2 } from "lucide-react"

const SidebarFile = ({data, selectFile, handleRename, handleDeleteFile}: {data: TFile, selectFile: (file: TTab) => void, handleRename: (id: string, newName: string, oldName: string, type: "file" | "folder") => boolean, handleDeleteFile: (file: TFile) => void}) => {
    const [imgSrc, setImgSrc] = useState(`/icons/${getIconForFile(data.name)}`)
    const [editing, setEditing] = useState(false)
    const [pendingDelete, setPendingDelete] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) {
            setTimeout(() => inputRef.current?.focus(), 0)
        }

        if (!inputRef.current) {
            console.log("no input ref")
        }

    }, [editing, inputRef.current])

    const renameFile = () => {
        const renamed = handleRename(data.id, inputRef.current?.value ?? data.name, data.name, "file")

        if (!renamed && inputRef.current) {
            inputRef.current.name = data.name
        }

        setEditing(false)
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger disabled={pendingDelete} onClick={() => {
                if (!editing && !pendingDelete) selectFile({...data, saved: true})
            }} className="data-[state=open]:bg-secondary/50 w-full flex items-center h-7 px-1 hover:bg-secondary rounded-sm cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <Image src={imgSrc} alt="File Icon" width={18} height={18} className="mr-2" onError={() => setImgSrc("/icons/default_file.svg")} />
                {pendingDelete ? (
                    <>
                        <Loader2 className="text-muted-foreground w-4 h-4 animate-spin mr-2" />
                        <div className="text-muted-foreground">Deleting...</div>
                    </>
                ) : (
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        renameFile()
                    }}>
                        <input className={`bg-transparent w-full outline-foreground ${
                            editing ? "" : "pointer-events-none"
                        }`} ref={inputRef} disabled={!editing} defaultValue={data.name} onBlur={() => renameFile()} />
                    </form>
                )}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => {setEditing(true)}}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Rename
                </ContextMenuItem>
                <ContextMenuItem disabled={pendingDelete} onClick={() => {
                    setPendingDelete(true)
                    handleDeleteFile(data)
                }}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default SidebarFile