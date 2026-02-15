"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "../../ui/input"
import { useRouter } from "next/navigation"

const DashboardNavbarSearch = () => {
    const [search, setSearch] = useState("")
    const router = useRouter()

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                router.push(`/dashboard?q=${search}`);
            } else {
                router.push(`/dashboard`)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [search])

    return (
        <div className="relative h-9 w-44 flex items-center justify-start shrink-0">
            <Search className="w-4 h-4 absolute left-2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Projects..." className="pl-8 w-full" />

        </div>
    )
}

export default DashboardNavbarSearch