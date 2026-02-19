
import Navbar from "@/components/editor/navbar"
import Room from "@/components/editor/live/room"
import { TFile, TFolder } from "@/components/editor/sidebar/types"
import { R2Files, User, UsersToVirtualboxes, VirtualBox} from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"
import dynamic from "next/dynamic"
import { notFound, redirect } from "next/navigation"

const CodeEditor = dynamic(() => import("@/components/editor"))

const getUserData = async (id: string) => {
  const userRes = await fetch(`https://database.mzli.workers.dev/api/user?id=${id}`);
  const userData = (await userRes.json()) as User;
  return userData
}

const getVirtualboxData = async (id: string) => {
  const virtualboxRes = await fetch(`https://database.mzli.workers.dev/api/virtualbox?id=${id}`)
  const virtualboxData: VirtualBox = await virtualboxRes.json()
  return virtualboxData
}

const getSharedUsers = async (usersToVirtualboxes: UsersToVirtualboxes[]) => {
  const shared = await Promise.all(usersToVirtualboxes?.map(async (user) => {
    const userRes = await fetch(`https://database.mzli.workers.dev/api/user?id=${user.id}`)
    const userData: User = await userRes.json()
    return {id: userData.id, name: userData.name}
  }))

  return shared
}

export default async function CodePage({params}: {params: {id: string}}) {
  const user = await currentUser();
  const {id: virtualboxId} = await params

  if (!user) {
    redirect("/");
  }

  const userData = await getUserData(user.id)
  const virtualboxData = await getVirtualboxData(virtualboxId)
  const shared = await getSharedUsers(virtualboxData.usersToVirtualboxes ?? [])

  return (
    <div className="overflow-hidden flex w-screen flex-col h-screen bg-background">
        <Room id={virtualboxId}>
          <Navbar userData={userData} virtualboxData={virtualboxData} shared={shared} />
          <div className="w-screen flex grow">
            <CodeEditor userId={user.id} virtualboxId={virtualboxId} /> 
          </div>
       </Room>
    </div>
  )
}
