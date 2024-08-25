import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.container.deleteMany()

    // Create sample containers
    const containers = [
        {
            dockerId: 'abc123',
            name: 'postgres-main',
            version: '13',
            port: 5432,
            username: 'admin',
            password: 'securepass123',
            status: 'running',
            url: 'postgres://admin:securepass123@localhost:5432/postgres-main'
        },
        {
            dockerId: 'def456',
            name: 'postgres-test',
            version: '12',
            port: 5433,
            username: 'testuser',
            password: 'testpass456',
            status: 'stopped',
            url: 'postgres://testuser:testpass456@localhost:5433/postgres-test'
        },
        {
            dockerId: 'ghi789',
            name: 'postgres-dev',
            version: '14',
            port: 5434,
            username: 'devuser',
            password: 'devpass789',
            status: 'running',
            url: 'postgres://devuser:devpass789@localhost:5434/postgres-dev'
        },
    ]

    for (const container of containers) {
        await prisma.container.create({
            data: container
        })
    }

    console.log('Seed data inserted successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })