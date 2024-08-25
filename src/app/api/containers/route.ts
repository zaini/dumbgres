import { NextResponse } from 'next/server'
import { CreateContainerRequest } from '@/types/container'

export async function POST(request: Request) {
    const body: CreateContainerRequest = await request.json()

    // TODO: Implement Docker container creation logic here
    // This is a placeholder implementation
    const containerId = 'mock_' + Math.random().toString(36).substr(2, 9)

    return NextResponse.json({
        id: containerId,
        name: body.name,
        url: `postgres://${body.username}:${body.password}@localhost:${body.port}/dbname`
    })
}

export async function GET() {
    // TODO: Implement fetching of running containers
    // This is a placeholder implementation
    const mockContainers = [
        { id: 'mock1', name: 'postgres1', status: 'running', url: 'postgres://user:pass@localhost:5432/db1' },
        { id: 'mock2', name: 'postgres2', status: 'running', url: 'postgres://user:pass@localhost:5433/db2' },
    ]

    return NextResponse.json(mockContainers)
}