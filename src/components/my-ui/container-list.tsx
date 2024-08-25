import { Container } from '@/types/container'
import { Database } from 'lucide-react'
import DeleteContainerButton from './delete-container-button'

async function getContainers(): Promise<Container[]> {
    const res = await fetch('http://localhost:3000/api/containers', { cache: 'no-store' })
    if (!res.ok) {
        throw new Error('Failed to fetch containers')
    }
    return res.json()
}

export default async function ContainerList() {
    const containers = await getContainers()

    return (
        <ul className="space-y-4">
            {containers.map((container) => (
                <li key={container.id} className="bg-white shadow rounded-lg p-4 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center">
                            <Database className="mr-2 h-5 w-5 text-blue-500" />
                            {container.name}
                        </h3>
                        <DeleteContainerButton container={container} />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Status: {container.status}</p>
                    <p className="text-sm text-gray-500">URL: {container.url}</p>
                </li>
            ))}
        </ul>
    )
}

