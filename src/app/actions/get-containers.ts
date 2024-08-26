'use server'

import prisma from '@/lib/db'
import Docker from 'dockerode'

const docker = new Docker()

// This function returns the containers from Docker - it doesn't care about the database
export async function getDockerContainers() {
    try {
        const images = await docker.listImages()
        const postgresImages = images.flatMap(i => i.RepoTags).filter(i => i != null && i.includes("postgres")) as string[]

        // Fetch containers from Docker
        const dockerContainers = await docker.listContainers({
            all: true,
            filters: { ancestor: postgresImages }
        })

        const containersAndDatabaseInfos = await Promise.all(dockerContainers.map(async container => {
            const databaseInfo = await prisma.databaseInfo.findUnique({
                where: { dockerId: container.Id }
            })
            return { containerInfo: container, databaseInfo }
        }))

        return { success: true, containersAndDatabaseInfos }
    } catch (error) {
        console.error('Error fetching and comparing containers:', error)
        return { success: false, message: (error as Error).message }
    }
}
