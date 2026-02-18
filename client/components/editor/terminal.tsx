"use client"

import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import { Terminal } from "@xterm/xterm"
import { decodeTerminalResponse } from "@/lib/utils"
import {FitAddon} from "@xterm/addon-fit"

const EditorTerminal = ({socket}: {socket: Socket}) => {
    const terminalRef = useRef(null)
    const [term, setTerm] = useState<Terminal | null>(null)

    useEffect(() => {
        if (!terminalRef.current) return

        const terminal = new Terminal({
            cursorBlink: false
        })

        setTerm(terminal)

        return () => {
            if (terminal) terminal.dispose()
        }
    }, []) 

    useEffect(() => {
        if (!term) return

        const onConnect = () => {
            setTimeout(() => {
                socket.emit("createTerminal", {id: "testId"})
            }, 500)
        }

        const onTerminalResponse = (data: Buffer) => {
            term.write(decodeTerminalResponse(data))
        }

        socket.on("connect", onConnect)

        if (terminalRef.current) {
            socket.on("terminalResponse", onTerminalResponse)

            const fitAddon = new FitAddon()

            term.loadAddon(fitAddon)
            term.open(terminalRef.current)
            fitAddon.fit()
            setTerm(term)
        }

        const disposable = term.onData((data) => {
            socket.emit("terminalData", {
                id: "testId", data
            })
        })

        socket.emit("terminalData", {
            data: "\n"
        })

        return () => {
            socket.off("connect", onConnect)
            socket.off("terminalResponse", onTerminalResponse)
            disposable.dispose()
        }

    }, [term, terminalRef.current])

    return (
        <div>
            <div ref={terminalRef} className="w-full h-1/2 text-left"></div>
        </div>
    )
}

export default EditorTerminal