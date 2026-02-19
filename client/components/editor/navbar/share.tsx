"use client"

import Avatar from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VirtualBox } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UserPlus, X } from "lucide-react"
import { useState } from "react"
import { Form, useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
    email: z.string().email()
})

const ShareVirtualboxModal = ({open, setOpen, data}: {open: boolean, setOpen: (open: boolean) => void, data: VirtualBox}) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <div className="p-6 pb-3 space-y-6">
                    <DialogHeader>
                        <DialogTitle>Share Virtualbox</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name="email" render={({field}) => (
                                <FormItem className="mr-4 w-full">
                                    <FormControl>
                                        <Input placeholder="test@domain.com" {...field} className="w-full"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button disabled={loading} type="submit" className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 h-4 w-4" /> Loading...
                                    </> 
                                ) : (
                                    <>
                                    <UserPlus className="mr-2 w-4 h-4" />
                                    Share
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="w-full h-[1px] bg-border" />
                <div className="p-6 pt-3">
                    <DialogHeader className="mb-3">
                        <DialogTitle>Manage Access</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Avatar name="Ming Zhe Li" className="mr-2" />
                                Ming Zhe Li
                            </div>
                            <Button variant={"ghost"} size="smIcon">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShareVirtualboxModal