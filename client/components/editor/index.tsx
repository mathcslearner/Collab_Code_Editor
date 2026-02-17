"use client"

import { X } from "lucide-react"
import { Button } from "../ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import { Editor, OnMount } from "@monaco-editor/react"
import { useRef, useState } from "react"
import monaco from "monaco-editor"
import Sidebar from "./sidebar"
import { useClerk } from "@clerk/nextjs"
import Tab from "../ui/tab"
import { TFile, TFolder } from "./sidebar/types"

const CodeEditor = ({files}: {files: (TFile | TFolder)[]}) => {
    const editorRef = useRef<null | monaco.editor.IStandaloneCodeEditor>(null);

    const clerk = useClerk();

    const [tabs, setTabs] = useState<TFile[]>([])
    const [activeId, setActiveId] = useState<string | null>(null)

    const selectFile = (tab: TFile) => {
        setTabs((prev) => {
            const exists = prev.find((t) => t.id === tab.id)

            if (exists) {
                setActiveId(exists.id)
                return prev
            }

            return [...prev, tab]
        })

        setActiveId(tab.id)
    }

    const closeTab = (tab: TFile) => {
        const numTabs = tabs.length
        const index = tabs.findIndex((t) => t.id === tab.id)

        setActiveId((prev) => {
            const next = prev === tab.id ? numTabs === 1 ? null : index < numTabs - 1 ? tabs[index + 1].id : tabs[index - 1].id : prev
            return next
        })

        setTabs((prev) => prev.filter((t => t.id !== tab.id)))
    }

    return (
        <>
        <Sidebar files={files} selectFile={selectFile}/>
        <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel minSize={30} defaultSize={60} className="flex flex-col p-2">
                <div className="h-10 w-full flex gap-2">
                    {tabs.map((tab) => (
                        <Tab key={tab.id} selected={activeId === tab.id} onClick={() => setActiveId(tab.id)} onClose={() => closeTab(tab)}>
                            {tab.name}
                        </Tab>
                    ))}
                </div>
                <div className="grow w-full overflow-hidden rounded-lg relative">
                    {clerk.loaded ? (
                        <Editor height={"100%"} defaultLanguage="typescript" theme="vs-dark" 
                        options={{
                            minimap: {
                                enabled: false
                            },
                            padding: {
                                bottom: 4,
                                top: 4
                            },
                            scrollBeyondLastLine: false
                        }}/>
                    ) : null}
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
                <ResizablePanelGroup orientation="vertical" >
                    <ResizablePanel defaultSize={40} minSize={25} className="p-2 flex flex-col">
                        <div className="h-10 w-full flex gap-2">
                            <Button variant={"secondary"} size={"sm"} className="min-w-20 justify-between">
                                localhost:3000 <X className="w-3 h-3" />
                            </Button>
                        </div>
                        <div className="w-full grow rounded-lg bg-foreground"></div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={50} minSize={20} className="p-2 flex flex-col">
                        <div className="h-10 w-full flex gap-2">
                            <Tab selected>Node.js</Tab>
                            <Tab>Console</Tab>
                        </div>
                        <div className="w-full grow rounded-lg bg-foreground"></div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
        </>
    )
}

export default CodeEditor