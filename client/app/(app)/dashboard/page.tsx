import Dashboard from "@/components/dashboard"
import Navbar from "@/components/navbar"
import { VirtualBox } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const DashboardPage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/");
    }

    const res = await fetch(`https://database.mzli.workers.dev/api/user/virtualbox?id=${user.id}`);
    const data = (await res.json()).virtualbox as VirtualBox[];
    
    return(
        <div>
            <Navbar />
            <Dashboard virtualboxes={data} />
        </div>
    )
}

export default DashboardPage