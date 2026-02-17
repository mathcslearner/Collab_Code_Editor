"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import CustomButton from "../ui/customButton"

type TOptions = "react" | "node"

const data: {
    id: TOptions,
    name: string,
    icon: string,
    description: string
}[] = [
    {
        id: "react",
        name: "React",
        icon: "/project-icons/react.svg",
        description: "A Javascript library for building user interfaces"
    },
    {
        id: "node",
        name: "Node",
        icon: "/project-icons/node.svg",
        description: "A Javascript runtime built on the V8 Javascript engine"
    }
]

const formSchema = z.object({
    name: z.string().min(1).max(16),
    visibility: z.enum(["public", "private"])
})

const newProject = ({open, setOpen}: {open: boolean, setOpen: (open:boolean) => void}) => {
    const [selected, setSelected] = useState<TOptions>("react")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            visibility: "public"
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const virtualboxData = {type: selected, ...values}
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create A Virtualbox
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 w-full gap-2 mt-2">
                    {data.map((item) => (
                        <button key={item.id} className={`${
                            selected === item.id ? "border-foreground" : "border-border"
                        } rounded-md border bg-card text-card-foreground shadow text-left p-4 flex flex-col transition-all focus-visible:outline-non focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-ring`}>
                            <div className="space-x-2 flex items-center justify-start w-full">
                                <Image src={item.icon} width={20} height={20} alt="" />
                                <div className="font-medium">{item.name}</div>
                            </div>
                            <div className="mt-2 text-muted-foreground">{item.description}</div>
                        </button>
                    ))}
                </div>
                <Form {...form}>
                    <form>
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem className="mb-4">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="My project..." {...field} />
                                </FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="visibility" render={({field}) => (
                            <FormItem className="mb-8">
                                <FormLabel>Visibility</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <CustomButton type="submit" className="w-full">
                            Submit
                        </CustomButton>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default newProject