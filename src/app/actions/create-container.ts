'use server'

import prisma from '@/lib/db'
import Docker from 'dockerode'
import { z } from 'zod'

const createContainerSchema = z.object({
    name: z.string(),
    version: z.string(),
    port: z.number().int().positive(),
    username: z.string(),
    password: z.string()
})

export async function createContainer(data: z.infer<typeof createContainerSchema>) {
    const validatedData = createContainerSchema.parse(data)

    const docker = new Docker()

    try {
        await docker.pull(`postgres:${validatedData.version}`)

        const container = await docker.createContainer({
            Image: `postgres:${validatedData.version}`,
            name: validatedData.name,
            Env: [
                `POSTGRES_USER=${validatedData.username}`,
                `POSTGRES_PASSWORD=${validatedData.password}`
            ],
            HostConfig: {
                PortBindings: {
                    '5432/tcp': [{ HostPort: validatedData.port.toString() }]
                }
            }
        })

        await container.start()

        const containerInfo = await container.inspect()

        const url = `postgres://${validatedData.username}:${validatedData.password}@localhost:${validatedData.port}/${validatedData.name}`

        const savedContainer = await prisma.container.create({
            data: {
                dockerId: containerInfo.Id,
                name: validatedData.name,
                version: validatedData.version,
                port: validatedData.port,
                username: validatedData.username,
                password: validatedData.password,
                status: containerInfo.State.Status,
                url: url
            }
        })

        if (savedContainer == null) {
            return { success: false, message: 'Error creating container' }
        }

        console.log({ success: true, message: 'Container created successfully', container: savedContainer })
        return { success: true, message: 'Container created successfully', container: savedContainer }
    } catch (error) {
        console.error('Error creating container:', error)
        return { success: false, message: (error as Error).message }
    }
}