"use client"

import { LogOut, Pencil } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"
import { User } from "@/lib/types"

const UserButton = ({userData}: {userData: User}) => {
    return (
        <div className="shrink-0">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="w-9 h-9 rounded-full overflow-hidden font-mon bg-gradient-to-t from-neutral-800 to-neutral-600 flex items-center text-sm font-medium justify-center">
                    {userData.name.split(" ").slice(0, 2).map((name) => name[0].toUpperCase())}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="!text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    )
}

export default UserButton