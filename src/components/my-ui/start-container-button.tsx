"use client"
import { ContainerInfo } from "dockerode";
import { Button } from "../ui/button";
import { Loader, Play } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { startDockerContainer } from "@/app/actions/start-container";

export default function StartContainerButton({ container }: { container: ContainerInfo }) {
    const [isStarting, setIsStarting] = useState(false)
    const { toast } = useToast()

    const handleStart = async () => {
        setIsStarting(true)
        try {
            const res = await startDockerContainer(container.Id)
            if (!res.success) {
                throw new Error(res.message)
            }
            toast({
                title: "Container started",
                description: `Container ${container.Names[0]} has been successfully started.`,
            })
            // You might want to trigger a refresh of the container list here
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to start the container. Please try again.',
                variant: "destructive",
            })
        } finally {
            setIsStarting(false)
        }
    }

    return (
        <Button
            size="sm"
            className="transition-all duration-300 hover:bg-green-600"
            onClick={handleStart}
            disabled={isStarting}
        >
            {isStarting ? <Loader className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
    )
}