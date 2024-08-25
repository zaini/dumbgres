"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import Docker from "dockerode"

async function deleteContainerFromDocker(containerDockerId: string) {
    const docker = new Docker()

    const dockerContainer = docker.getContainer(containerDockerId)
    await dockerContainer.remove({ force: true })
}

export async function deleteContainer(containerDockerId: string) {
    try {
        let errors = []
        try {
            // Delete the container from Docker
            await deleteContainerFromDocker(containerDockerId)
        } catch (error) {
            console.error("Error deleting container from Docker:", error)
            errors.push("Failed to delete the container from Docker")
        }

        try {
            // Remove the container from the database
            await prisma.container.delete({
                where: { dockerId: containerDockerId },
            })
        } catch (error) {
            console.error("Error deleting container from database:", error)
            errors.push("Failed to delete the container from the database")
        }

        if (errors.length > 0) {
            revalidatePath("/")
            return { success: false, message: errors.join(", ") }
        }

        // Revalidate the path to update the UI
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error deleting container:", error)
        return { success: false, message: "Failed to delete the container" }
    }
}