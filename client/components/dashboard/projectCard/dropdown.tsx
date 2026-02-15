"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { VirtualBox } from "@/lib/types"
import { Ellipsis, Lock, Trash2 } from "lucide-react"

const ProjectCardDropdown = ({virtualbox}: {virtualbox: VirtualBox}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }} className="h-6 w-6 flex items-center justify-center transition-colors bg-transparent hover:bg-muted-foreground/25 rounded-sm">
                <Ellipsis className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                <DropdownMenuItem>
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Make Private</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Trash2 className="mr-2 h-4 w-4"></Trash2>
                    <span>Delete Project</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProjectCardDropdown