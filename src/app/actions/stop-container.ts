'use server'

import Docker from 'dockerode'
import { revalidatePath } from 'next/cache'

export async function stopDockerContainer(containerDockerId: string) {
    try {
        const docker = new Docker()
        const dockerContainer = docker.getContainer(containerDockerId)
        await dockerContainer.stop()
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error stopping container:', error)
        return { success: false, message: (error as Error).message }
    }
}