"use client"

import { FilePlus, FolderPlus, Search } from "lucide-react"
import SidebarFolder from "./folder"
import SidebarFile from "./file"
import { TFile, TFolder } from "./types"

const Sidebar = ({files, selectFile}: {files: (TFile | TFolder)[]; selectFile: (tab: TFile) => void}) => {
    return(
        <div className="h-full w-56 flex flex-col items-start p-2">
            <div className="flex  w-full items-center justify-between h-8 mb-1">
                <div className="text-muted-foreground">Explorer</div>
                <div className="flex space-x-1">
                    <div className="h-6 w-6 text-muted-foreground ml-0.5 flex items-center justify-center translate-x-1 transition-colors bg-transparent hover:bg-muted-foreground/25 cursor-pointer rounded-sm">
                        <FilePlus className="h-4 w-4" />
                    </div>
                    <div className="h-6 w-6 text-muted-foreground ml-0.5 flex items-center justify-center translate-x-1 transition-colors bg-transparent hover:bg-muted-foreground/25 cursor-pointer rounded-sm">
                        <FolderPlus className="h-4 w-4" />
                    </div>
                    <div className="h-6 w-6 text-muted-foreground ml-0.5 flex items-center justify-center translate-x-1 transition-colors bg-transparent hover:bg-muted-foreground/25 cursor-pointer rounded-sm">
                        <Search className="w-4 h-4" />
                    </div>
                </div>
            </div>
            <div className="w-full mt-1 flex flex-col">
                {files.map((child) => 
                    child.type === "file" ? (
                        <SidebarFile key={child.id} data={child} selectFile={selectFile}/> 
                    ) : ( 
                        <SidebarFolder key={child.id} data={child} selectFile={selectFile}/>
                    )
                )}
            </div>
        </div>
    )
}

export default Sidebar