'use server'

import Docker from 'dockerode'
import { PrismaClient, Container } from '@prisma/client'

const prisma = new PrismaClient()
const docker = new Docker()

export interface ContainerWithDiscrepancy extends Container {
    discrepancies?: Record<string, { docker: any; db: any }>;
}

export async function getContainers(): Promise<{ containers: ContainerWithDiscrepancy[], discrepancies: string[] }> {
    try {
        const images = await docker.listImages()
        const postgresImages = images.flatMap(i => i.RepoTags).filter(i => i != null && i.includes("postgres")) as string[]

        // Fetch containers from Docker
        const dockerContainers = await docker.listContainers({
            all: true,
            filters: { ancestor: postgresImages }
        })

        // Fetch containers from Prisma
        const dbContainers = await prisma.container.findMany()

        // Map Docker containers to our Container format
        const formattedDockerContainers: Container[] = await Promise.all(dockerContainers.map(async (container) => {
            const containerInfo = await docker.getContainer(container.Id).inspect()
            const name = containerInfo.Name.replace(/^\//, '')
            const port = containerInfo.NetworkSettings.Ports['5432/tcp']?.[0]?.HostPort || '5432'
            const envVars = containerInfo.Config.Env.reduce((acc, env) => {
                const [key, value] = env.split('=')
                acc[key] = value
                return acc
            }, {} as Record<string, string>)

            return {
                dockerId: container.Id,
                name,
                version: container.Image.split(':')[1] || 'latest',
                port: parseInt(port),
                username: envVars['POSTGRES_USER'] || 'postgres',
                password: envVars['POSTGRES_PASSWORD'] || '',
                status: container.State,
                url: `postgres://${envVars['POSTGRES_USER'] || 'postgres'}:${envVars['POSTGRES_PASSWORD']}@localhost:${port}/${name}`
            } as Container
        }))

        const containersWithDiscrepancies: ContainerWithDiscrepancy[] = []
        const discrepancies: string[] = []

        for (const dockerContainer of formattedDockerContainers) {
            const dbContainer = dbContainers.find(c => c.dockerId === dockerContainer.dockerId)

            if (!dbContainer) {
                // Container exists in Docker but not in DB
                containersWithDiscrepancies.push({
                    ...dockerContainer,
                    id: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    discrepancies: {
                        existence: { docker: 'Exists', db: 'Does not exist' }
                    }
                })
                discrepancies.push(`Container ${dockerContainer.name} (${dockerContainer.dockerId}) exists in Docker but not in the database`)
            } else {
                // Container exists in both, check for discrepancies
                const containerDiscrepancies: Record<string, { docker: any; db: any }> = {}

                for (const [key, value] of Object.entries(dockerContainer)) {
                    const k = key as keyof Container
                    if (dbContainer[k] !== value) {
                        containerDiscrepancies[key] = { docker: value, db: dbContainer[k] }
                    }
                }

                if (Object.keys(containerDiscrepancies).length > 0) {
                    containersWithDiscrepancies.push({ ...dbContainer, discrepancies: containerDiscrepancies })
                    discrepancies.push(`Container ${dbContainer.name} (${dbContainer.dockerId}) has discrepancies between Docker and database`)
                }
            }
        }

        // Check for containers in DB that don't exist in Docker
        for (const dbContainer of dbContainers) {
            console.log({ dockerId: dbContainer.dockerId, cIds: formattedDockerContainers.map(c => c.dockerId) })
            if (!formattedDockerContainers.some(c => c.dockerId === dbContainer.dockerId)) {
                containersWithDiscrepancies.push({
                    ...dbContainer,
                    discrepancies: {
                        existence: { docker: 'Does not exist', db: 'Exists' }
                    }
                })
                discrepancies.push(`Container ${dbContainer.name} (${dbContainer.dockerId}) exists in the database but not in Docker`)
            }
        }

        return {
            containers: [...containersWithDiscrepancies, ...dbContainers.filter(c => !containersWithDiscrepancies.some(dc => dc.id === c.id))],
            discrepancies
        }
    } catch (error) {
        console.error('Error fetching and comparing containers:', error)
        return { containers: [], discrepancies: ['Error fetching and comparing containers'] }
    }
}