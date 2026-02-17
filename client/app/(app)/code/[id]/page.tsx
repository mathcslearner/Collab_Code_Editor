
import Navbar from "@/components/editor/navbar"
import { TFile, TFolder } from "@/components/editor/sidebar/types"
import { R2Files, User } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"
import dynamic from "next/dynamic"
import { notFound, redirect } from "next/navigation"

const CodeEditor = dynamic(() => import("@/components/editor"))

const getUserData = async (id: string) => {
  const userRes = await fetch(`https://database.mzli.workers.dev/api/user?id=${id}`);
  const userData = (await userRes.json()) as User;
  return userData
}

const getVirtualboxFiles = async (id: string) => {
  const virtualboxRes = await fetch(`https://storage.mzli.workers.dev/api?virtualboxId=${id}`)
  const virtualboxData: R2Files = await virtualboxRes.json()

  if (virtualboxData.objects.length === 0) return notFound()

  const paths = virtualboxData.objects.map((obj) => obj.key)

  return processFiles(paths, id)
}

const processFiles = (paths: string[], id: string): (TFile | TFolder)[] => {
  const root: TFolder = {id: "/", type: "folder", name: "/", children: []}

  paths.forEach((path) => {
    const allParts = path.split("/")
    if (allParts[1] !== id) return notFound()

    const parts = allParts.slice(2)
    let current: TFolder = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1 && part.includes(".")
      const existing = current.children.find((child) => child.name === part)

      if (existing) {
        if (!isFile) {
          current = existing as TFolder
        }
      } else {
        if (isFile) {
          const file: TFile = {id: path, type: "file", name: part}
          current.children.push(file)
        } else {
          const folder: TFolder = {id: path, type: "folder", name: part, children: []}
          current.children.push(folder)
          current = folder
        }
      }
    }
  })

  return root.children
}

export default async function CodePage({params}: {params: {id: string}}) {
  const user = await currentUser();
  const {id: virtualboxId} = await params

  if (!user) {
    redirect("/");
  }

  const userData = await getUserData(user.id)
  const virtualboxFiles = await getVirtualboxFiles(virtualboxId)

  return (
    <div className="flex w-screen flex-col h-screen bg-background">
      <div className="h-12 flex">
        <Navbar userData={userData}/>
      </div>
      <div className="w-screen flex grow">
        <CodeEditor files={virtualboxFiles} /> 
      </div>
    </div>
  )
}
