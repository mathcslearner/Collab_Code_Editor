import Dashboard from "@/components/dashboard"
import Navbar from "@/components/navbar"
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
    
    return(
        <div>
            <Navbar userData={userData}/>
            <Dashboard virtualboxes={userData.virtualbox} />
        </div>
    )
}

export default DashboardPage