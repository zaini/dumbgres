import { Database, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getContainers } from '@/app/actions/get-containers'
import DeleteContainerButton from './delete-container-button'
import ContainerDiff from './container-diff'

export default async function ContainerList() {
    const { containers, discrepancies } = await getContainers()

    return (
        <div className="space-y-4">
            {discrepancies.length > 0 && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Discrepancies Detected</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-5">
                            {discrepancies.map((discrepancy, index) => (
                                <li key={index}>{discrepancy}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
            <ul className="space-y-4">
                {containers.map((container) => (
                    <li key={container.id} className={`bg-white shadow rounded-lg p-4 transition-all duration-300 hover:shadow-lg ${container.discrepancies ? 'border-2 border-yellow-500' : ''}`}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Database className="mr-2 h-5 w-5 text-blue-500" />
                                {container.name}
                                {container.discrepancies && (
                                    <span className="ml-2 text-sm text-yellow-600">(Discrepancies found)</span>
                                )}
                            </h3>
                            <DeleteContainerButton container={container} />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Status: {container.status}</p>
                        <p className="text-sm text-gray-500">URL: {container.url}</p>
                        <p className="text-sm text-gray-500">Docker ID: {container.dockerId}</p>
                        <ContainerDiff container={container} />
                    </li>
                ))}
            </ul>
        </div>
    )
}