"use client"

import { TFile } from "./types"
import Image from "next/image"
import { useState } from "react"
import { getIconForFile } from "vscode-icons-js"

const SidebarFile = ({data, selectFile}: {data: TFile, selectFile: (file: TFile) => void}) => {
    const [imgSrc, setImgSrc] = useState(`/icons/${getIconForFile(data.name)}`)

    return (
        <button onClick={() => selectFile(data)} className="w-full flex items-center h-7 px-1 hover:bg-secondary rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
            <Image src={imgSrc} alt="File Icon" width={16} height={16} className="mr-2" onError={() => setImgSrc("/icons/default_file.svg")}/>
            {data.name}
        </button>
    )
}

export default SidebarFile