"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

const New = ({type, stopEditing}: {type: "file"|"folder", stopEditing: () => void}) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const createFile = () => {
        stopEditing()
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <div className="w-full flex items-center h-7 px-1 hover:bg-secondary rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
            <Image src={type === "file" ? "/icons/default_file.svg" : "/icons/default_folder.svg"} alt="File Icon" width={18} height={18} className="mr-2" />
            <form onSubmit={(e) => {
                e.preventDefault()
                createFile()
            }}>
                <input className={`bg-transparentrounded-sm w-full outline-foreground transition-all focus-visible:outline-none focus-visible-ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-ring`} ref={inputRef} onBlur={() => createFile()} />
            </form>
        </div>
    )
}

export default New