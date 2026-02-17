
import Navbar from "@/components/editor/navbar"
import { TFile, TFolder } from "@/components/editor/sidebar/types"
import { R2Files, User, VirtualBox} from "@/lib/types"
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

export default async function CodePage({params}: {params: {id: string}}) {
  const user = await currentUser();
  const {id: virtualboxId} = await params

  if (!user) {
    redirect("/");
  }

  const userData = await getUserData(user.id)
  const virtualboxData = await getVirtualboxData(virtualboxId)

  return (
    <div className="flex w-screen flex-col h-screen bg-background">
      <div className="h-12 flex">
        <Navbar userData={userData} virtualboxData={virtualboxData} />
      </div>
      <div className="w-screen flex grow">
        <CodeEditor userId={user.id} virtualboxId={virtualboxId} /> 
      </div>
    </div>
  )
}
