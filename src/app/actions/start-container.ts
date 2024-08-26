'use server'

import Docker from 'dockerode'
import { revalidatePath } from 'next/cache'

export async function startDockerContainer(containerDockerId: string) {
    try {
        const docker = new Docker()
        const dockerContainer = docker.getContainer(containerDockerId)
        await dockerContainer.start()
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error starting container:', error)
        return { success: false, message: (error as Error).message }
    }
}