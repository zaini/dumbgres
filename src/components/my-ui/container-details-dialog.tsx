import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Container } from '@prisma/client'
import { Button } from "../ui/button";

interface DetailDialogProps {
    containerDetails: Container | null;
    errorDetails: string | null;
}

export default function DetailDialog({ containerDetails, errorDetails }: DetailDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {containerDetails ? 'View Details' : 'View Error'}
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[50rem]">
                <DialogHeader>
                    <DialogTitle>{containerDetails ? 'Container Details' : 'Error Details'}</DialogTitle>
                    <DialogDescription>
                        {containerDetails ? (
                            <div>
                                <p>Name: {containerDetails.name}</p>
                                <p>Version: {containerDetails.version}</p>
                                <p>Port: {containerDetails.port}</p>
                                <p>Username: {containerDetails.username}</p>
                                <p>Docker ID: {containerDetails.dockerId}</p>
                                <p>Status: {containerDetails.status}</p>
                                <p>URL: {containerDetails.url}</p>
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