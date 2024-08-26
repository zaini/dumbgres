"use client"
import { ContainerInfo } from "dockerode";
import { Button } from "../ui/button";
import { Loader, Square } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { stopDockerContainer } from "@/app/actions/stop-container";

export default function StopContainerButton({ container }: { container: ContainerInfo }) {
    const [isStopping, setIsStopping] = useState(false)
    const { toast } = useToast()

    const handleStop = async () => {
        setIsStopping(true)
        try {
            const res = await stopDockerContainer(container.Id)
            if (!res.success) {
                throw new Error(res.message)
            }
            toast({
                title: "Container stopped",
                description: `Container ${container.Names[0]} has been successfully stopped.`,
            })
            // You might want to trigger a refresh of the container list here
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to stop the container. Please try again.',
                variant: "destructive",
            })
        } finally {
            setIsStopping(false)
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            className="transition-all duration-300 hover:bg-red-600"
            onClick={handleStop}
            disabled={isStopping}
        >
            {isStopping ? <Loader className="h-4 w-4" /> : <Square className="h-4 w-4" />}
        </Button>
    )
}
