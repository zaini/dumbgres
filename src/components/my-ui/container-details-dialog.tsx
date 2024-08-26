import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { ContainerInspectInfo } from "dockerode";
import { DatabaseInfo } from "@prisma/client";

interface DetailDialogProps {
    container?: ContainerInspectInfo;
    database?: DatabaseInfo;
    errorDetails?: string;
}

export default function DetailDialog({ container, database, errorDetails }: DetailDialogProps) {
    const url = `postgres://${database?.user}:${database?.password}@localhost:${database?.port}/${database?.name}`

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {container ? 'View Details' : 'View Error'}
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[50rem]">
                <DialogHeader>
                    <DialogTitle>{container ? 'Container Details' : 'Error Details'}</DialogTitle>
                    <DialogDescription>
                        {container ? (
                            <div>
                                <p>Name: {container.Name}</p>
                                <p>Image: {container.Config.Image}</p>
                                <p>Status: {container.State.Status}</p>
                                <p>URL: <code>{url}</code></p>
                            </div>
                        ) : (
                            <pre className='whitespace-pre-wrap'>{errorDetails}</pre>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}