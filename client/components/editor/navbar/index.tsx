import Image from "next/image"
import Logo from "@/assets/logo.svg"
import Link from "next/link"
import { User } from "@/lib/types"
import UserButton from "../../ui/userButton"
import { Pencil } from "lucide-react"

const Navbar = ({userData}: {userData: User}) => {
    return (
        <div className="h-14 px-2 w-full border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Link href={"/"} className="ring-offset-2 ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none rounded-sm">
                    <Image src={Logo} alt="Logo" width={36} height={36} />
                </Link>
                <div className="text-sm font-medium flex items-center">
                    My React Project {" "}
                    <div className="h-7 w-7 ml-2 flex items-center justify-center">
                        <Pencil className="w-4 h-4" />
                    </div>
                </div>
            </div>
                <UserButton userData={userData} />
        </div>
    )
}

export default Navbar