"use client"

import { TFile, TTab } from "./types"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { getIconForFile } from "vscode-icons-js"

const SidebarFile = ({data, selectFile, handleRename}: {data: TFile, selectFile: (file: TTab) => void, handleRename: (id: string, newName: string, oldName: string, type: "file" | "folder") => boolean}) => {
    const [imgSrc, setImgSrc] = useState(`/icons/${getIconForFile(data.name)}`)
    const [editing, setEditing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
        }
    }, [editing])

    const renameFile = () => {
        const renamed = handleRename(data.id, inputRef.current?.value ?? data.name, data.name, "file")

        if (!renamed && inputRef.current) {
            inputRef.current.name = data.name
        }

        setEditing(false)
    }

    return (
        <button onDoubleClick={() => setEditing(true)} onClick={() => selectFile({...data, saved: true})} className="w-full flex items-center h-7 px-1 hover:bg-secondary rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
            <Image src={imgSrc} alt="File Icon" width={16} height={16} className="mr-2" onError={() => setImgSrc("/icons/default_file.svg")}/>
            <form onSubmit={(e) => {
                e.preventDefault()
                renameFile()
            }}>
                <input className={`bg-transparent w-full outline-foreground ${
                    editing ? "" : "pointer-events-none"
                }`} ref={inputRef} disabled={!editing} defaultValue={data.name} onBlur={() => renameFile()} />
            </form>
        </button>
    )
}

export default SidebarFile