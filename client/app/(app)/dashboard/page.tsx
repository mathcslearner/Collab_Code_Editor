import Dashboard from "@/components/dashboard"
import Navbar from "@/components/dashboard/navbar"
import { User, VirtualBox } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const DashboardPage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/");
    }

    const userRes = await fetch(`https://database.mzli.workers.dev/api/user?id=${user.id}`);
    const userData = (await userRes.json()) as User;

    const sharedRes = await fetch(`https://database.mzli.workers.dev/api/share?id=${user.id}`)
    const shared = (await sharedRes.json()) as {
        id: string
        name: string
        type: "react" | "node"
        author: {id: string, name: string, email: string, image: any}
        sharedOn: Date
    }[]
    
    return(
        <div>
            <Navbar userData={userData}/>
            <Dashboard virtualboxes={userData.virtualbox} shared={shared} />
        </div>
    )
}

export default DashboardPage