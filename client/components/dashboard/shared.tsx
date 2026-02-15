import { VirtualBox } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import Image from "next/image"
import { Button } from "../ui/button"
import { ChevronRight } from "lucide-react"

const DashboardSharedWithMe = ({virtualboxes}: {virtualboxes: VirtualBox[]}) => {
    return (
        <div className="grow p-4 flex flex-col">
            <div className="text-xl font-medium mb-8">Shared With Me</div>
            <div className="grow w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Virtualbox Name</TableHead>
                            <TableHead>Shared By</TableHead>
                            <TableHead>Opened</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {virtualboxes.map((virtualbox) => (
                            <TableRow key={virtualbox.id}>
                                <TableCell>
                                    <div className="font-medium flex items-center">
                                        <Image src={virtualbox.type == "react" ? "/project-icons/react.svg" : "/project-icons/node-svg"} width={20} height={20} className="mr-2" alt="" />
                                        {virtualbox.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <div className="h-5 w-5 bg-red-500 rounded-full mr-2"></div>
                                        Ming Zhe Li 
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date().toLocaleDateString()}
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