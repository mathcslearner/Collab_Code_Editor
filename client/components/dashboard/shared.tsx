import { VirtualBox } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import Image from "next/image"
import { Button } from "../ui/button"
import { ChevronRight } from "lucide-react"
import Avatar from "../ui/avatar"

const DashboardSharedWithMe = ({shared}: { shared: {id: string, name: string, type: "react" | "node", author: {id: string, name: string, email: string}, sharedOn: Date}[]}) => {
    return (
        <div className="grow p-4 flex flex-col">
            <div className="text-xl font-medium mb-8">Shared With Me</div>
            <div className="grow w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Virtualbox Name</TableHead>
                            <TableHead>Shared By</TableHead>
                            <TableHead>Sent On</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shared.map((virtualbox) => (
                            <TableRow key={virtualbox.id}>
                                <TableCell>
                                    <div className="font-medium flex items-center">
                                        <Image src={virtualbox.type == "react" ? "/project-icons/react.svg" : "/project-icons/node-svg"} width={20} height={20} className="mr-2" alt="" />
                                        {virtualbox.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Avatar name={virtualbox.author.name} className="mr-2" />
                                        {virtualbox.author.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(virtualbox.sharedOn).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button>
                                        Open <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DashboardSharedWithMe