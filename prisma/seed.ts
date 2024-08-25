import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create a user with posts
    const user1 = await prisma.user.create({
        data: {
            name: 'Alice',
            Post: {
                create: [
                    {
                        title: 'First Post by Alice',
                        content: 'This is the content of the first post by Alice.',
                    },
                    {
                        title: 'Second Post by Alice',
                        content: 'This is the content of the second post by Alice.',
                    },
                ],
            },
        },
    })

    const user2 = await prisma.user.create({
        data: {
            name: 'Bob',
            Post: {
                create: [
                    {
                        title: 'First Post by Bob',
                        content: 'This is the content of the first post by Bob.',
                    },
                ],
            },
        },
    })

    const user3 = await prisma.user.create({
        data: {
            name: 'Charlie',
            Post: {
                create: [
                    {
                        title: 'First Post by Charlie',
                        content: 'This is the content of the first post by Charlie.',
                    },
                    {
                        title: 'Second Post by Charlie',
                        content: 'This is the content of the second post by Charlie.',
                    },
                    {
                        title: 'Third Post by Charlie',
                        content: 'This is the content of the third post by Charlie.',
                    },
                ],
            },
        },
    })

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
