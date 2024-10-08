"use client"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteDockerContainer } from "@/app/actions/delete-container"
import { ContainerInfo } from "dockerode"

export default function DeleteContainerButton({ container }: { container: ContainerInfo }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await deleteDockerContainer(container.Id)
            if (!res.success) {
                throw new Error(res.message)
            }
            toast({
                title: "Container deleted",
                description: `Container ${container.Names[0]} has been successfully deleted.`,
            })
            // You might want to trigger a refresh of the container list here
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to delete the container. Please try again.',
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="transition-all duration-300 hover:bg-red-600">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        container &quot;{container.Names[0]}&quot; and remove all associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}