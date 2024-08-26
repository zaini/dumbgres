"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import Docker from "dockerode"

async function deleteContainerFromDocker(containerDockerId: string) {
    const docker = new Docker()

    const dockerContainer = docker.getContainer(containerDockerId)
    await dockerContainer.remove({ force: true })
}

export async function deleteDockerContainer(containerDockerId: string) {
    let errors = []
    try {
        await deleteContainerFromDocker(containerDockerId)
        await prisma.databaseInfo.delete({ where: { dockerId: containerDockerId } })
    } catch (error) {
        console.error("Error deleting container from Docker/DB:", error)
        errors.push("Failed to delete the container from Docker/DB")
    }

    if (errors.length > 0) {
        revalidatePath("/")
        return { success: false, message: errors.join(", ") }
    }

    // Revalidate the path to update the UI
    revalidatePath("/")
    return { success: true }
}
