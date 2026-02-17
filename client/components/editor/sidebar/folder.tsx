"use client"

import { useEffect, useRef, useState } from "react"
import { TFile, TFolder, TTab } from "./types"
import { getIconForFolder, getIconForOpenFolder } from "vscode-icons-js"
import Image from "next/image"
import SidebarFile from "./file"

const SidebarFolder = ({data, selectFile, handleRename}: {data: TFolder, selectFile: (file: TTab) => void, handleRename: (id: string, newName: string, oldName: string, type: "file" | "folder") => boolean}) => {
    const [isOpen, setIsOpen] = useState(false)
    const folder = isOpen ? getIconForOpenFolder(data.name) : getIconForFolder(data.name);

    const [editing, setEditing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus()
        }
    }, [editing])

    const renameFolder = () => {
        const renamed = handleRename(data.id, inputRef.current?.value ?? data.name, data.name, "file")

        if (!renamed && inputRef.current) {
            inputRef.current.name = data.name
        }

        setEditing(false)
    }

    return (
        <>
        <div onDoubleClick={() => {setEditing(true)} } onClick={() => setIsOpen((prev) => !prev)} className="w-full flex items-center h-7 px-1 transition-colors hover:bg-secondary cursor-pointer rounded-sm">
            <Image src={`/icons/${folder}`} alt="Folder icon" width={18} height={18} className="mr-2" />
            <form onSubmit={(e) => {
                e.preventDefault()
                setEditing(false)
            }}>
                <input className={`bg-transparent w-full outline-foreground ${
                    editing ? "" : "pointer-events-none"
                }`} ref={inputRef} disabled={!editing} defaultValue={data.name} onBlur={() => setEditing(false)} />
            </form>
        </div>
        {isOpen ? (
            <div className="flex w-full items-stretch">
                <div className="w-px bg-border mx-2 h-full"></div>
                <div className="flex flex-col grow">
                    {data.children.map((child) => child.type === "file" ? (
                        <SidebarFile key={child.id} data={child} selectFile={selectFile} handleRename={handleRename}/>
                    ) : (
                        <SidebarFolder key={child.id} data={child} selectFile={selectFile} handleRename={handleRename}/>
                    ))}
                </div>
            </div>
        ) : null}
        </>
    )
}

export default SidebarFolder