
import Navbar from "@/components/editor/navbar"
import { User } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"

const CodeEditor = dynamic(() => import("@/components/editor"))

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const userRes = await fetch(`https://database.mzli.workers.dev/api/user?id=${user.id}`);
  const userData = (await userRes.json()) as User;

  return (
    <div className="flex w-screen flex-col h-screen bg-background">
      <div className="h-12 flex">
        <Navbar userData={userData}/>
      </div>
      <div className="w-screen flex grow">
        <CodeEditor /> 
      </div>
    </div>
  )
}
