'use server'

import prisma from '@/lib/db'
import Docker from 'dockerode'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createContainerSchema = z.object({
    name: z.string(),
    version: z.string(),
    port: z.number().int().positive(),
    username: z.string(),
    password: z.string()
})

type CreateContainerRequest = z.infer<typeof createContainerSchema>

export async function createContainer(data: CreateContainerRequest) {
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

        const databaseInfo = await prisma.databaseInfo.create({
            data: {
                name: validatedData.name,
                port: validatedData.port,
                user: validatedData.username,
                password: validatedData.password,
                dockerId: containerInfo.Id
            }
        })

        console.log({ success: true, message: 'Container created successfully', container: containerInfo, database: databaseInfo })
        revalidatePath('/')
        return { success: true, message: 'Container created successfully', container: containerInfo, database: databaseInfo }
    } catch (error) {
        console.error('Error creating container:', error)
        revalidatePath('/')
        return { success: false, message: (error as Error).message }
    }
}
